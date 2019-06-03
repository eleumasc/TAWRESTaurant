import { enumHasValue } from "../helpers/enumHasValue";

export enum TableStatus {
  Free = "free",
  NotServed = "not-served",
  Waiting = "waiting",
  Served = "served"
}

export function isTableStatus(arg: any): arg is TableStatus {
  return arg && typeof arg === "string" && enumHasValue(TableStatus, arg);
}

export enum TableOrderStatus {
  Pending = "pending",
  Ready = "ready",
  Served = "served"
}

export function isTableOrderStatus(arg: any): arg is TableStatus {
  return arg && typeof arg === "string" && enumHasValue(TableOrderStatus, arg);
}

export type Table = {
  readonly _id: string;
  number: number;
  seats: number;
  status: TableStatus;
  numOfCustomers: number;
  servedBy: string; // (<Waiter>servedBy)._id
  occupiedAt: string; // Date
  ordersTakenAt: string; // Date
  foodOrdersStatus: TableOrderStatus;
  beverageOrdersStatus: TableOrderStatus;
};
