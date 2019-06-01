import { error } from "../helpers/error";

export function checkRequest(check: Function) {
  return (req, res, next) => {
    if (!check(req)) return res.status(400).json(error("Bad Request"));
    next();
  };
}
