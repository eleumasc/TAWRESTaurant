import { UserRole } from "../models/user";

export function setBody(fields: Array<string>, values: Array<string>) {
  return (req, res, next) => {
    req.body = req.body || {};
    fields.forEach((field, idx) => {
      req.body[field] = values[idx];
    });
    next();
  };
}
