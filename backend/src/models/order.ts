import mongoose = require("mongoose");
import { enumHasValue } from "../helpers/enumHasValue";
import { UserRole, Cook, Barman } from "./user";
import { MenuItemKind, Food, Beverage } from "./menuItem";
import { Table } from "./table";

export enum OrderKind {
  FoodOrder = "FoodOrder",
  BeverageOrder = "BeverageOrder"
}

export function isOrderKind(arg: any): arg is OrderKind {
  return arg && typeof arg === "string" && enumHasValue(OrderKind, arg);
}

export type Order = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  table: Table;
  status: OrderStatus;
  kind: OrderKind;
};

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Ready = "ready"
}

export function isOrderStatus(arg: any): arg is OrderStatus {
  return arg && typeof arg === "string" && enumHasValue(OrderStatus, arg);
}

export type FoodOrder = Order & {
  kind: OrderKind.FoodOrder;
  food: Food;
  cook: Cook;
};

export type BeverageOrder = Order & {
  kind: OrderKind.BeverageOrder;
  beverage: Beverage;
  barman: Barman;
};

export const orderSchema: mongoose.Schema<Order> = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Table"
    },
    status: {
      type: mongoose.Schema.Types.String,
      required: false,
      default: OrderStatus.Pending
    },
    kind: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  },
  { discriminatorKey: "kind" }
);

export const foodOrderSchema: mongoose.Schema<FoodOrder> = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MenuItemKind.Food,
    required: false,
    default: null
  },
  cook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.Cook,
    required: false,
    default: null
  }
});
export const beverageOrderSchema: mongoose.Schema<
  BeverageOrder
> = new mongoose.Schema({
  beverage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MenuItemKind.Beverage,
    required: false,
    default: null
  },
  barman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.Barman,
    required: false,
    default: null
  }
});
