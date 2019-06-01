import { enumHasValue } from "../../helpers/enumHasValue";
import { UserRole } from "../user";
import { isUndefined } from "util";
import { error } from "../../helpers/error";

export type CreateTableForm = {
  number: Number;
  seats: Number;
};

export enum ChangeStatus {
  Occupy = "occupy",
  Free = "free"
}

export function isCreateTableForm(req: any): req is CreateTableForm {
  return (
    req.body &&
    req.body.number &&
    typeof req.body.number === "number" &&
    req.body.seats &&
    typeof req.body.seats === "number" &&
    req.body.seats > 0
  );
}

export function isOccupyFreeRequest(req: any): boolean {
  const { query, body, user } = req;
  return (
    req &&
    query.action &&
    ((body.numOfCustomers &&
      typeof body.numOfCustomers === "number" &&
      body.numOfCustomers > 0 &&
      user.role === UserRole.Waiter &&
      query.action === ChangeStatus.Occupy) ||
      (user.role === UserRole.Cashier && query.action === ChangeStatus.Free))
  );
}
