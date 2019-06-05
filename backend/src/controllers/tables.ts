import { io } from "../server";
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { checkRequest } from "../middlewares/checkRequest";
import { error } from "../helpers/error";
import { WaiterModel, TableModel, OrderModel, UserModel } from "../models";
import { ObjectId } from "bson";
import { UserRole, Waiter } from "../models/user";
import {
  Table,
  TableStatus,
  isTableStatus,
  isTableOrderStatus
} from "../models/table";
import {
  isCreateTableForm,
  isOccupyFreeRequest,
  ChangeStatus
} from "../models/forms/table";
import { tableByIdOrders as tableByIdOrdersRoute } from "./orders";

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
        callback: changeTableStatus
      },
      DELETE: {
        middlewares: [userHasRole([UserRole.Cashier])],
        callback: deleteTable
      }
    }
  ],
  GET: { callback: getTables },
  POST: {
    middlewares: [
      userHasRole([UserRole.Cashier]),
      checkRequest(isCreateTableForm)
    ],
    callback: createTable
  }
};

function getTables(req, res, next) {
  const filter: any = {};
  if (req.query.seats) filter.seats = { $gte: parseInt(req.query.seats) };
  if (req.query.status && isTableStatus(req.query.status))
    filter.status = req.query.status;
  if (req.query.servedById && ObjectId.isValid(req.query.servedById))
    filter.servedBy = req.query.servedById;
  if (
    req.query.foodOrdersStatus &&
    isTableOrderStatus(req.query.foodOrdersStatus)
  )
    filter.foodOrdersStatus = req.query.foodOrdersStatus;
  if (
    req.query.beverageOrdersStatus &&
    isTableOrderStatus(req.query.beverageOrdersStatus)
  )
    filter.beverageOrdersStatus = req.query.beverageOrdersStatus;

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

function createTable(req, res, next) {
  const table: Table = new TableModel(req.body);
  table
    .save()
    .then(() => {
      res.json(table);
    })
    .catch(next);
}

function changeTableStatus(req, res, next) {
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
    return res.status(409).json(error("Table is already occupied"));

  WaiterModel.findOne({ _id: req.user._id })
    .then((waiter: Waiter) => {
      if (!waiter) {
        return res.status(403).json(error("JWT error, please re-login"));
      }

      table.status = TableStatus.NotServed;
      table.numOfCustomers = req.body.numOfCustomers;
      table.servedBy = waiter._id;
      table.occupiedAt = new Date();

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

function freeTable(table: Table, req, res, next) {
  if (table.status === TableStatus.Free)
    return res.status(409).json(error("Table is already free"));

  OrderModel.deleteMany({ table: table._id })
    .then(() => {
      const numOfCustomers = table.numOfCustomers;
      const servedBy = table.servedBy;

      table.status = TableStatus.Free;
      table.numOfCustomers = 0;
      table.servedBy = null;
      table.occupiedAt = null;
      table.ordersTakenAt = null;
      table.foodOrdersStatus = null;
      table.beverageOrdersStatus = null;

      table
        .save()
        .then(() => {
          WaiterModel.updateOne(
            { _id: servedBy },
            { $inc: { totalServedCustomers: numOfCustomers } }
          )
            .then(() => {})
            .catch(() => {});

          io.emit("table status changed", table);
          res.send();
        })
        .catch(next);
    })
    .catch(next);
}

function deleteTable(req, res, next) {
  TableModel.findOne({
    _id: req.urlParams.idT
  })
    .then((table: Table) => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }

      TableModel.deleteOne({ _id: req.urlParams.idT })
        .then(() => {
          res.send();
        })
        .catch(next);
    })
    .catch(next);
}
