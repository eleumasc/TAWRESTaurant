import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import { TableModel, OrderModel, WaiterModel } from "../models";
import { UserRole } from "../models/user";
import {
  isCreateTableForm,
  isOccupyFreeRequest,
  ChangeStatus
} from "../models/forms/table";
import { Table, TableStatus, isTableStatus } from "../models/table";
import { ObjectId } from "bson";
import { isOrderStatus } from "../models/order";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { tableByIdOrders as tableByIdOrdersRoute } from "./orders";
import { io } from "../server";
import { checkRequest } from "../middlewares/checkRequest";
import { asyncWrap } from "../middlewares/asyncWrapper";

export const tables: Route = {
  path: "/tables",
  middlewares: [jwtAuth],
  subRoutes: [
    {
      path: "/byId/:idT",
      middlewares: [addParams("idT")],
      subRoutes: [tableByIdOrdersRoute],
      GET: { callback: getTable },
      PUT: {
        middlewares: [checkRequest(isOccupyFreeRequest)],
        callback: putChangeTableStatus
      },
      DELETE: {
        middlewares: [userHasRole([UserRole.Cashier])],
        callback: asyncWrap(deleteTable)
      }
    }
  ],
  GET: { callback: getTables },
  POST: {
    middlewares: [
      userHasRole([UserRole.Cashier]),
      checkRequest(isCreateTableForm)
    ],
    callback: asyncWrap(createTable)
  }
};

function getTables(req, res, next) {
  const {
    seats,
    status,
    servedById,
    foodOrdersStatus,
    beverageOrdersStatus
  } = req.query;
  const filter: any = {};
  if (seats) filter.seats = { $gte: parseInt(seats) };
  if (status && isTableStatus(status)) filter.status = status;
  if (servedById && ObjectId.isValid(servedById)) filter.servedBy = servedById;
  if (foodOrdersStatus && isOrderStatus(foodOrdersStatus))
    filter.foodOrdersStatus = servedById;
  if (beverageOrdersStatus && isOrderStatus(beverageOrdersStatus))
    filter.beverageOrdersStatus = servedById;
  TableModel.find(filter)
    .then(tables => res.json(tables))
    .catch(next);
}

function getTable(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then(table => {
      if (!table) return res.status(404).json(error("Table not found"));
      return res.json(table);
    })
    .catch(next);
}

/*async function getTable(req, res, next) {
  let table: Table = await TableModel.findOne({ _id: req.urlParams.idT });
  if (!table) return res.status(404).json(error("Table not found"));
  return res.json(table);
}*/

/*function createTable(req, res, next) {
  let table: Table;
  table = new TableModel(req.body);
  table
    .save()
    .then(() => res.json(table))
    .catch(next);
}*/

async function createTable(req, res, next) {
  let table: Table = new TableModel(req.body);
  await table.save();
  res.json(table);
}

function putChangeTableStatus(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then((table: Table) => {
      if (!table) return res.status(404).json(error("Table not found"));
      if (
        req.query.action === ChangeStatus.Occupy &&
        req.user.role === UserRole.Waiter
      )
        return occupyTable(table, req, res, next);
      if (
        req.query.action === ChangeStatus.Free &&
        req.user.role === UserRole.Cashier
      )
        return freeTable(table, req, res, next);
      return res
        .status(403)
        .json(
          error(
            "Unauthorized, you must have the following role: " +
              req.user.role ===
              UserRole.Cashier
              ? UserRole.Waiter
              : UserRole.Cashier
          )
        );
    })
    .catch(next);
}

function occupyTable(table: Table, req, res, next) {
  if (table.seats < req.body.numOfCustomers)
    return res.status(400).json(error("Not enough seats"));
  if (table.status !== TableStatus.Free)
    return res.status(400).json(error("Table is already occupied"));
  table.status = TableStatus.NotServed;
  table.numOfCustomers = req.body.numOfCustomers;
  table.servedBy = req.user._id;
  table.occupiedAt = new Date();
  table
    .save()
    .then(() => {
      io.emit("table status changed", table);
      return res.send();
    })
    .catch(next);
}

function freeTable(table: Table, req, res, next) {
  if (table.status === TableStatus.Free)
    return res.status(400).json(error("Table is already free"));
  OrderModel.deleteMany({ table: table._id })
    .then(() => {
      let numOfCustomers = table.numOfCustomers;
      WaiterModel.findOne({ _id: table.servedBy }).then(waiter => {
        waiter.totalServedCustomers += numOfCustomers;
        waiter
          .save()
          .then()
          .catch(next);
      });
      table.status = TableStatus.Free;
      table.numOfCustomers = 0;
      table.servedBy = null;
      table.ordersTakenAt = null;
      table.foodOrdersStatus = null;
      table.beverageOrdersStatus = null;
      table
        .save()
        .then(() => {
          io.emit("table status changed", table);
          res.send();
        })
        .catch(next);
    })
    .catch(next);
}

/*function deleteTable(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      TableModel.deleteOne({ _id: req.urlParams.idT })
        .then(() => res.send())
        .catch(next);
    })
    .catch(next);
}*/

async function deleteTable(req, res, next) {
  let table: Table = await TableModel.findOne({
    _id: req.urlParams.idT
  }).then();
  if (!table) {
    return res.status(404).json(error("Table not found"));
  }
  await TableModel.deleteOne({ _id: req.urlParams.idT }).then();
  res.send();
}
