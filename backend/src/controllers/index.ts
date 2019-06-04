const express = require("express");
import { Router, RequestHandler } from "express";
import { RequestHandlerParams } from "express-serve-static-core";
import bodyParser = require("body-parser");
import { login as loginRoute } from "./login";
import usersRoute from "./users";
import { tables as tablesRoute } from "./tables";
import { menu as menuRoute } from "./menu";

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
  let router: Router = express.Router();
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
      res.send("API V1");
    }
  }
};

export const root: Route = {
  path: "/",
  subRoutes: [apiv1],
  GET: {
    callback: (req, res) => {
      res.send("root");
    }
  }
};
/*
const routes = {
  "/": {
    GET: { res: "subRoutes" }
  },
  "/users": {
    "/": {
      GET: { res: "Array<User>" }
    },
    "/byId/:id": {
      "/": {
        GET: { res: "User" },
        DELETE: { res: "nothing" }
      },
      "/password": {
        PUT: { body: "{password}", res: "User" }
      }
    },
    "/barmans": {
      "/": {
        GET: { res: "Array<Barman>" },
        POST: { body: "{username, name, surname, password}", res: "Barman" }
      },
      "/byId/:id/orders": {
        GET: { res: "Array<BeverageOrder>" }
      }
    },
    "/cashiers": {
      "/": {
        GET: { res: "Array<Cashier>" },
        POST: { body: "{username, name, surname, password}", res: "Cashier" }
      }
    },
    "/cooks": {
      "/": {
        GET: { res: "Array<Cook>" },
        POST: { body: "{username, name, surname, password}", res: "Cook" }
      },
      "/byId/:id/orders": {
        GET: { res: "Array<FoodOrder>" }
      }
    },
    "/waiters": {
      "/": {
        GET: { res: "Array<Waiter>" },
        POST: { body: "{username, name, surname, password}", res: "Waiter" }
      },
      "/byId/:id/tables": {
        GET: { res: "Array<Table>" }
      }
    }
  },
  "/menu": {
    "/": {
      GET: { res: "Array<MenuItem>" }
    },
    "/byId/:id": {
      GET: { res: "MenuItem" }
    },
    "/foods": {
      GET: { res: "Array<Food>" }
    },
    "/beverages": {
      GET: { res: "Array<Beverage>" }
    }
  },
  "/tables": {
    "/": {
      GET: {
        query:
          "{status, seats, tableStatus, foodOrdersStatus, beverageOrdersStatus}",
        res: "Array<Table>"
      }
    },
    "/byId/:id": {
      "/": {
        GET: { res: "Table" },
        PUT: { action: '"occupy" | "free"', res: "Table" }
      },
      "/orders": {
        "/": {
          GET: { query: "{status}", res: "Array<Order>" },
          PUT: { action: '"commit"' }
        },
        "/byId/:id": {
          GET: { res: "Order" },
          PUT: { action: '"assign" | "notify-ready"', res: "Order" },
          DELETE: { res: "nothing" }
        },
        "/foodOrders": {
          GET: { query: "{status}", res: " Array<FoodOrder>" },
          POST: { body: "{food}", res: "FoodOrder" },
          PUT: { query: "{action: 'notify-served'}", res: "OK" }
        },
        "/beverageOrders": {
          GET: { query: "{status}", res: "Array<BeverageOrder>" },
          POST: { body: "{beverage}", res: "BeverageOrder" },
          PUT: { query: "{action: 'notify-served'}", res: "OK" }
        }
      }
    }
  }
};


const util = require("util");
console.log("subRoutes:\n", util.inspect(subRoutes, false, null, true));
*/
