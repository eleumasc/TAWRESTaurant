import { Route } from ".";
import {
  TableModel,
  OrderModel,
  FoodOrderModel,
  BeverageOrderModel
} from "../models";
import { error } from "../helpers/error";
import { TableStatus } from "../models/table";
import { OrderStatus, OrderKind, Order } from "../models/order";
import { UserRole } from "../models/user";
import { addParams } from "../middlewares/addParams";
import { io } from "../server";
import { Socket } from "socket.io";
import { setQuery } from "../middlewares/setQuery";
import { setBody } from "../middlewares/setBody";
import { userHasRole } from "../middlewares/userHasRole";
import { checkRequest } from "../middlewares/checkRequest";
import {
  isChangeOrderStatus,
  isCreateOrderForm,
  ChangeOrderStatus
} from "../models/forms/order";

const tableFoodOrders: Route = {
  path: "/foodOrders",
  GET: {
    middlewares: [setQuery(["kind"], [OrderKind.FoodOrder])],
    callback: getTableOrders
  },
  POST: {
    middlewares: [
      setBody(["kind"], [OrderKind.FoodOrder]),
      checkRequest(isCreateOrderForm)
    ],
    callback: postTableOrder
  }
};

const tableBeverageOrders: Route = {
  path: "/beverageOrders",
  GET: {
    middlewares: [setQuery(["kind"], [OrderKind.BeverageOrder])],
    callback: getTableOrders
  },
  POST: {
    middlewares: [setBody(["kind"], [OrderKind.BeverageOrder])],
    callback: postTableOrder
  }
};

export const tableByIdOrders: Route = {
  path: "/orders",
  subRoutes: [
    {
      path: "/byId/:idO",
      middlewares: [addParams("idO")],
      GET: { callback: getTableOrder },
      PUT: {
        middlewares: [
          userHasRole([UserRole.Cook, UserRole.Barman]),
          checkRequest(isChangeOrderStatus)
        ],
        callback: putTableOrder
      },
      DELETE: { callback: deleteTableOrder }
    },
    tableFoodOrders,
    tableBeverageOrders
  ],
  GET: { callback: getTableOrders },
  PUT: { callback: putTableCommitOrders }
};

function getTableOrders(req, res, next) {
  const { status, kind } = req.query;
  let filter: any = { table: req.urlParams.idT };
  if (status) filter.status = status;
  if (kind) filter.kind = kind;
  OrderModel.find(filter).exec((err, orders) => {
    if (err) return next(err);
    res.json(orders);
  });
}

function putTableCommitOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      table.status = TableStatus.Waiting;
      table.ordersTakenAt = new Date();
      table
        .save()
        .then(() => res.json(table))
        .catch(err => next(err));
      io.to(UserRole.Barman).emit("orders are taken", table);
      io.to(UserRole.Cook).emit("orders are taken", table);
    })
    .catch(err => next(err));
}

function getTableOrder(req, res) {
  OrderModel.findOne({ _id: req.urlParams.idO, table: req.urlParams.idT }).then(
    order => {
      if (!order) return res.status(404).json(error("Order not found"));
      return res.json(order);
    }
  );
}

function putTableOrder(req, res, next) {
  OrderModel.findOne({
    _id: req.urlParams.idO,
    table: req.urlParams.idT
  }).then((order: any) => {
    if (!order) return res.status(404).json(error("Order not found"));
    if (
      req.query.action === ChangeOrderStatus.Assign &&
      ((req.user.role === UserRole.Cook &&
        order.kind === OrderKind.FoodOrder) ||
        (req.user.role === UserRole.Barman &&
          order.kind === OrderKind.BeverageOrder))
    )
      assignOrder(order, req, res, next);
    if (req.query.action === ChangeOrderStatus.Notify)
      notifyOrder(order, req, res, next);
  });
}

function assignOrder(order, req, res, next) {
  order.status = OrderStatus.Preparing;
  order[req.user.role.toLowerCase()] = req.user._id;
  order
    .save()
    .then(() => {
      if (order.status === OrderStatus.Ready) {
        io.to(UserRole.Waiter).emit("order is ready", order);
        OrderModel.countDocuments({
          table: order.table,
          status: { $not: OrderStatus.Ready }
        }); //TODO
      } else {
        io.to(req.user.role).emit("order is preparing", order);
      }
      res.json(order);
    })
    .catch(err => next(err));
}

function notifyOrder(order, req, res, next) {
  order.status = OrderStatus.Ready;
  order
    .save()
    .then(() => {
      if (order.status === OrderStatus.Ready) {
        io.to(UserRole.Waiter).emit("order is ready", order);
        OrderModel.countDocuments({
          table: order.table,
          status: { $not: OrderStatus.Ready }
        }); //TODO
      } else {
        io.to(req.user.role).emit("order is preparing", order);
      }
      res.json(order);
    })
    .catch(err => next(err));
}

function deleteTableOrder(req, res, next) {
  OrderModel.findOne({
    _id: req.urlParams.idO,
    table: req.urlParams.idT
  }).then(order => {
    if (!order) return res.status(404).json(error("Order not found"));
    OrderModel.deleteOne({ _id: req.urlParams.idO })
      .then(() => {
        res.send();
      })
      .catch(err => next(err));
  });
}

function postTableOrder(req, res, next) {
  const { kind } = req.body;
  req.body.table = req.urlParams.idT;
  let order: Order;
  switch (kind) {
    case OrderKind.FoodOrder:
      order = new FoodOrderModel(req.body);
      break;
    case OrderKind.BeverageOrder:
      order = new BeverageOrderModel(req.body);
      break;
  }
  order
    .save()
    .then(() => {
      res.json(order);
    })
    .catch(err => next(err));
}
