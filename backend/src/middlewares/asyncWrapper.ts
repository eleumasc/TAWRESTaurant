import { RequestHandler } from "express";

type asyncFn = (
  req: Request,
  res: Response,
  next: RequestHandler
) => Promise<void>;

export function asyncWrap(async: asyncFn) {
  return (req, res, next) => {
    async(req, res, next).then(() => {}, next);
  };
}
