import { enumHasValue } from "../../helpers/enumHasValue";
import { UserRole } from "../user";
import { isOrderKind, OrderKind } from "../order";
import { ObjectId } from "bson";

export type CreateOrderForm = {
  number: Number;
  seats: Number;
};

export enum ChangeOrderStatus {
  Assign = "assign",
  Notify = "notify"
}

export function isCreateOrderForm(req: any): req is CreateOrderForm {
  return (
    req.body &&
    req.body.kind &&
    typeof req.body.kind === "string" &&
    isOrderKind(req.body.kind) &&
    ((req.body.kind === OrderKind.BeverageOrder &&
      ObjectId.isValid(req.body.beverage)) ||
      (req.body.kind === OrderKind.FoodOrder &&
        ObjectId.isValid(req.body.food)))
  );
}

export function isChangeOrderStatus(req: any): boolean {
  return enumHasValue(ChangeOrderStatus, req.query.action);
}
