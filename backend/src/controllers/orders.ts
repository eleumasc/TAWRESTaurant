import { io } from "../server";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { setQuery } from "../middlewares/setQuery";
import { setBody } from "../middlewares/setBody";
import { checkRequest } from "../middlewares/checkRequest";
import { userHasRole } from "../middlewares/userHasRole";
import { enumHasValue } from "../helpers/enumHasValue";
import { error } from "../helpers/error";
import {
  CookModel,
  BarmanModel,
  TableModel,
  OrderModel,
  FoodOrderModel,
  BeverageOrderModel
} from "../models";
import { TableStatus, TableOrderStatus, Table } from "../models/table";
import {
  OrderKind,
  OrderStatus,
  Order,
  FoodOrder,
  BeverageOrder
} from "../models/order";
import { UserRole } from "../models/user";
import { isCreateOrderForm } from "../models/forms/order";

const tableFoodOrders: Route = {
  path: "/foodOrders",
  GET: {
    middlewares: [setQuery(["kind"], [OrderKind.FoodOrder])],
    callback: getOrdersByTable
  },
  POST: {
    middlewares: [
      setBody(["kind"], [OrderKind.FoodOrder]),
      checkRequest(isCreateOrderForm)
    ],
    callback: addOrderOfTable
  },
  PUT: {
    middlewares: [
      setQuery(["orderKind"], [OrderKind.FoodOrder]),
      userHasRole([UserRole.Waiter])
    ],
    callback: notifyOrdersAsServed
  }
};

const tableBeverageOrders: Route = {
  path: "/beverageOrders",
  GET: {
    middlewares: [setQuery(["kind"], [OrderKind.BeverageOrder])],
    callback: getOrdersByTable
  },
  POST: {
    middlewares: [setBody(["kind"], [OrderKind.BeverageOrder])],
    callback: addOrderOfTable
  },
  PUT: {
    middlewares: [
      setQuery(["orderKind"], [OrderKind.BeverageOrder]),
      userHasRole([UserRole.Waiter])
    ],
    callback: notifyOrdersAsServed
  }
};

export const tableByIdOrders: Route = {
  path: "/orders",
  subRoutes: [
    {
      path: "/byId/:idO",
      middlewares: [addParams("idO")],
      GET: { callback: getOrderByTableAndId },
      PUT: {
        middlewares: [
          userHasRole([UserRole.Cook, UserRole.Barman]),
          checkRequest(hasChangeOrderStatusAction)
        ],
        callback: changeOrderStatus
      },
      DELETE: { callback: removeOrderOfTable }
    },
    tableFoodOrders,
    tableBeverageOrders
  ],
  GET: { callback: getOrdersByTable },
  PUT: { callback: commitOrdersByTable }
};

function getOrdersByTable(req, res, next) {
  const { status, kind } = req.query;

  const filter: any = { table: req.urlParams.idT };
  if (status) filter.status = status;
  if (kind) filter.kind = kind;

  OrderModel.find(filter)
    .populate("food beverage")
    .exec()
    .then((orders: Order[]) => {
      res.json(orders);
    })
    .catch(next);
}

function getOrderByTableAndId(req, res, next) {
  OrderModel.findOne({ _id: req.urlParams.idO, table: req.urlParams.idT })
    .populate("food beverage")
    .exec()
    .then((order: Order) => {
      if (!order) return res.status(404).json(error("Order not found"));
      return res.json(order);
    })
    .catch(next);
}

// FIXME: The "food"/"beverage" field of resulting order is not populated
function addOrderOfTable(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then((table: Table) => {
      if (!table) return res.status(404).json(error("Table not found"));

      if (table.servedBy.toString() !== req.user._id) {
        return res
          .status(403)
          .json(error("Forbidden, you are not serving this table"));
      }

      req.body.table = req.urlParams.idT;

      const order: Order =
        req.body.kind === OrderKind.FoodOrder
          ? new FoodOrderModel(req.body)
          : new BeverageOrderModel(req.body);

      order
        .save()
        .then(() => {
          order
            .populate("food beverage")
            .execPopulate()
            .then((populatedOrder: Order) => res.json(populatedOrder))
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

function removeOrderOfTable(req, res, next) {
  OrderModel.findOne({
    _id: req.urlParams.idO,
    table: req.urlParams.idT
  })
    .then((order: Order) => {
      if (!order) return res.status(404).json(error("Order not found"));

      OrderModel.deleteOne({ _id: req.urlParams.idO })
        .then(() => res.send())
        .catch(next);
    })
    .catch(next);
}

function commitOrdersByTable(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.idT })
    .then((table: Table) => {
      if (!table) return res.status(404).json(error("Table not found"));

      if (table.status === TableStatus.Waiting)
        return res
          .status(409)
          .json(error("Orders have already been committed"));

      table.status = TableStatus.Waiting;
      table.ordersTakenAt = new Date();
      table.foodOrdersStatus = TableOrderStatus.Pending;
      table.beverageOrdersStatus = TableOrderStatus.Pending;

      OrderModel.find({ table: table._id })
        .then((orders: Order[]) => {
          if (
            !orders.some((order: Order) => order.kind === OrderKind.FoodOrder)
          ) {
            table.foodOrdersStatus = TableOrderStatus.Served;
          }
          if (
            !orders.some(
              (order: Order) => order.kind === OrderKind.BeverageOrder
            )
          ) {
            table.beverageOrdersStatus = TableOrderStatus.Served;
          }

          table
            .save()
            .then(() => {
              io.emit("table status changed", table);
              res.json(table);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

export enum ChangeOrderStatusAction {
  Assign = "assign",
  Notify = "notify"
}

export function hasChangeOrderStatusAction(req): boolean {
  return enumHasValue(ChangeOrderStatusAction, req.query.action);
}

function changeOrderStatus(req, res, next) {
  OrderModel.findOne({
    _id: req.urlParams.idO,
    table: req.urlParams.idT
  })
    .populate("food beverage")
    .exec()
    .then((order: Order) => {
      if (!order) return res.status(404).json(error("Order not found"));

      if (
        (req.user.role !== UserRole.Cook ||
          order.kind !== OrderKind.FoodOrder) &&
        (req.user.role !== UserRole.Barman ||
          order.kind !== OrderKind.BeverageOrder)
      ) {
        return res.status(403).json(error("This is not your kind of order"));
      }

      if (req.query.action === ChangeOrderStatusAction.Assign) {
        if (order.status === OrderStatus.Pending) {
          return assignOrder(order, req, res, next);
        } else {
          return res.status(409).json(error("Order has already been assigned"));
        }
      } else if (req.query.action === ChangeOrderStatusAction.Notify) {
        if (order.status === OrderStatus.Preparing) {
          return notifyOrderAsReady(order, req, res, next);
        } else if (order.status === OrderStatus.Pending) {
          return res.status(409).json(error("Order has not been prepared yet"));
        } else if (order.status === OrderStatus.Ready) {
          return res.status(409).json(error("Order has already been notified"));
        }
      }
    })
    .catch(next);
}

function assignOrder(order: Order, req, res, next) {
  const filter: any = { status: OrderStatus.Preparing };
  if (order.kind === OrderKind.FoodOrder) {
    filter.cook = req.user._id;
  } else {
    filter.barman = req.user._id;
  }

  (order.kind === OrderKind.FoodOrder ? FoodOrderModel : BeverageOrderModel)
    .countDocuments(filter)
    .then((count: number) => {
      if (count > 0)
        return res
          .status(409)
          .json(error(req.user.role + " already has an order assigned"));

      order.status = OrderStatus.Preparing;
      if (order.kind === OrderKind.FoodOrder) {
        (<FoodOrder>order).cook = req.user._id;
      } else {
        (<BeverageOrder>order).barman = req.user._id;
      }

      order
        .save()
        .then(() => {
          io.emit("order status changed", order);
          res.json(order);
        })
        .catch(next);
    })
    .catch(next);
}

function notifyOrderAsReady(order: Order, req, res, next) {
  if (
    (order.kind === OrderKind.FoodOrder &&
      (<FoodOrder>order).cook.toString() !== req.user._id) ||
    (order.kind === OrderKind.BeverageOrder &&
      (<BeverageOrder>order).barman.toString() !== req.user._id)
  ) {
    return res.status(403).json(error("Forbidden, you are not preparing this"));
  }

  order.status = OrderStatus.Ready;

  order
    .save()
    .then(() => {
      if (order.kind === OrderKind.FoodOrder) {
        CookModel.updateOne(
          { _id: req.user._id },
          { $inc: { totalPreparedDishes: 1 } }
        )
          .then(() => {})
          .catch(next);
      } else if (order.kind === OrderKind.BeverageOrder) {
        BarmanModel.updateOne(
          { _id: req.user._id },
          { $inc: { totalPreparedBeverages: 1 } }
        )
          .then(() => {})
          .catch(next);
      }

      io.emit("order status changed", order);
      res.json(order);
    })
    .catch(next);
}

function notifyOrdersAsServed(req, res, next) {
  if (req.query.action !== "notify-served")
    return res.status(400).json(error("Bad request"));

  TableModel.findOne({ _id: req.urlParams.idT })
    .then((table: Table) => {
      if (!table) return res.status(404).json(error("Table not found"));

      if (table.servedBy.toString() !== req.user._id)
        return res
          .status(403)
          .json(error("Forbidden, you are not serving this table"));

      if (req.query.orderKind === OrderKind.FoodOrder) {
        if (table.foodOrdersStatus !== TableOrderStatus.Ready) {
          return res.status(409).json(error("Orders are not ready"));
        } else {
          table.foodOrdersStatus = TableOrderStatus.Served;
        }
      } else {
        if (table.beverageOrdersStatus !== TableOrderStatus.Ready) {
          return res.status(409).json(error("Orders are not ready"));
        } else {
          table.beverageOrdersStatus = TableOrderStatus.Served;
        }
      }

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
