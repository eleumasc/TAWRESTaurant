import { UserRole } from "../models/user";

export function setQuery(fields: Array<string>, values: Array<string>) {
  return (req, res, next) => {
    req.query = req.query || {};
    fields.forEach((field, idx) => {
      req.query[field] = values[idx];
    });
    next();
  };
}
