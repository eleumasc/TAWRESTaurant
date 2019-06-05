const express = require("express");
import { Router, RequestHandler } from "express";
import { RequestHandlerParams } from "express-serve-static-core";
import bodyParser = require("body-parser");
import { login as loginRoute } from "./login";
import { users as usersRoute } from "./users";
import { menu as menuRoute } from "./menu";
import { tables as tablesRoute } from "./tables";

export type METHOD = {
  middlewares?: Array<RequestHandler>;
  callback: RequestHandlerParams;
};

export type Route = {
  path: string;
  middlewares?: Array<RequestHandler>;
  subRoutes?: Array<Route>;
  GET?: METHOD;
  POST?: METHOD;
  PUT?: METHOD;
  DELETE?: METHOD;
};

function autoNext(req, res, next) {
  next();
}

export function createRouter(route: Route): Router {
  const { path, middlewares, subRoutes, GET, POST, PUT, DELETE } = route;
  const router: Router = express.Router();

  if (middlewares) router.use(path, middlewares);

  if (GET) {
    if (!GET.middlewares) GET.middlewares = [autoNext];
    router.get(path, GET.middlewares, GET.callback);
  }

  if (POST) {
    if (!POST.middlewares) POST.middlewares = [autoNext];
    router.post(path, POST.middlewares, POST.callback);
  }

  if (PUT) {
    if (!PUT.middlewares) PUT.middlewares = [autoNext];
    router.put(path, PUT.middlewares, PUT.callback);
  }

  if (DELETE) {
    if (!DELETE.middlewares) DELETE.middlewares = [autoNext];
    router.delete(path, DELETE.middlewares, DELETE.callback);
  }

  if (subRoutes)
    subRoutes.forEach((subRoute: Route) => {
      router.use(path, createRouter(subRoute));
    });
  return router;
}

const apiv1: Route = {
  path: "/api/v1",
  middlewares: [bodyParser.json()],
  subRoutes: [loginRoute, usersRoute, tablesRoute, menuRoute],
  GET: {
    callback: (req, res) => {
      res.json({ name: "TAWRESTaurant API", version: "1.0.0" });
    }
  }
};

export const root: Route = {
  path: "/",
  subRoutes: [apiv1],
  GET: {
    callback: (req, res) => {
      res.json({ greeting: "Hello world!" });
    }
  }
};
