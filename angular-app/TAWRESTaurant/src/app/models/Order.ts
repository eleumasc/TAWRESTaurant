import { enumHasValue } from "../helpers/enumHasValue";
import { Food, Beverage } from "./MenuItem";

export enum OrderKind {
  FoodOrder = "FoodOrder",
  BeverageOrder = "BeverageOrder"
}

export function isOrderKind(arg: any): arg is OrderKind {
  return arg && typeof arg === "string" && enumHasValue(OrderKind, arg);
}

export type Order = {
  readonly _id: string;
  table: string; // (<Table>table)._id
  status: OrderStatus;
  kind: OrderKind;
  food: Food;
  cook: string;
  beverage: Beverage;
  barman: string;
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
  cook: string; // (<Cook>cook)._id
};

export type BeverageOrder = Order & {
  kind: OrderKind.BeverageOrder;
  beverage: Beverage;
  barman: string; // (<Barman>barman)._id
};
