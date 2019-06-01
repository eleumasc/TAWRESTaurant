import mongoose = require("mongoose");
import { enumHasValue } from "../helpers/enumHasValue";
import { UserRole, Waiter } from "./user";

export enum TableStatus {
  Free = "free", //no customers
  NotServed = "not-served", //customers but no orders taken
  Waiting = "waiting", //orders taken, but not served to the table
  Served = "served" //all orders served to the table
}

export function isTableStatus(arg: any): arg is TableStatus {
  return arg && typeof arg === "string" && enumHasValue(TableStatus, arg);
}

export enum TableOrderStatus {
  Pending = "pending", //orders committed to the cooks, barmans
  Ready = "ready", //orders ready to be served
  Served = "served" //orders served to the table
}

export function isTableOrderStatus(arg: any): arg is TableOrderStatus {
  return arg && typeof arg === "string" && enumHasValue(TableOrderStatus, arg);
}

export type Table = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  number: number;
  seats: number;
  status: TableStatus;
  numOfCustomers: number;
  servedBy: Waiter;
  ordersTakenAt: Date;
  foodOrdersStatus: TableOrderStatus;
  foodsReadyAt: Date;
  beverageOrdersStatus: TableOrderStatus;
  beveragesReadyAt: Date;
};

export const tableSchema: mongoose.Schema<Table> = new mongoose.Schema({
  number: { type: mongoose.Schema.Types.Number, required: true, unique: true },
  seats: { type: mongoose.Schema.Types.Number, required: true },
  status: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: TableStatus.Free
  },
  numOfCustomers: {
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 0
  },
  servedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.Waiter,
    required: false,
    default: null
  },
  foodOrdersStatus: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null
  },
  foodsReadyAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  },
  beverageOrdersStatus: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null
  },
  beveragesReadyAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  }
});
