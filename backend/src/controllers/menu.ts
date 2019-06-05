import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { error } from "../helpers/error";
import { UserRole } from "../models/user";
import { MenuItemModel } from "../models";
import { MenuItem, isMenuItemKind } from "../models/menuItem";
import {
  isCreateMenuItemForm,
  isChangeMenuItemForm
} from "../models/forms/menuItem";

export const menu: Route = {
  path: "/menu",
  middlewares: [jwtAuth],
  subRoutes: [
    {
      path: "/byId/:idM",
      middlewares: [addParams("idM")],
      GET: { callback: getMenuItemById },
      DELETE: {
        middlewares: [userHasRole([UserRole.Cashier])],
        callback: deleteMenuItem
      }
    }
  ],
  GET: { callback: getMenuItems },
  POST: {
    middlewares: [userHasRole([UserRole.Cashier])],
    callback: postMenuItem
  },
  PUT: {
    middlewares: [userHasRole([UserRole.Cashier])],
    callback: putMenuItem
  }
};

function getMenuItems(req, res, next) {
  const filter: any = {};
  if (req.query && typeof req.query === "string") {
    filter.query = req.query;
  }
  if (req.query.price && !isNaN(req.query.price)) {
    filter.price = {
      $lte: parseFloat(req.query.price) + 1,
      $gte: parseFloat(req.query.price) - 1
    };
  }
  if (req.query.preparationTime && !isNaN(req.query.preparationTime)) {
    filter.preparationTime = {
      $lte: parseFloat(req.query.preparationTime) + 1,
      $gte: parseFloat(req.query.preparationTime) - 1
    };
  }
  if (req.query.kind && isMenuItemKind(req.query.kind)) {
    filter.kind = req.query.kind;
  }

  MenuItemModel.find(filter)
    .then(menuItems => res.json(menuItems))
    .catch(next);
}

function getMenuItemById(req, res, next) {
  MenuItemModel.findOne({ _id: req.params.idM })
    .then(menuItem => {
      if (!menuItem) {
        return res.status(404).json(error("MenuItem not found"));
      }
      return res.json(menuItem);
    })
    .catch(next);
}

function postMenuItem(req, res, next) {
  if (!isCreateMenuItemForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  const menuItem: MenuItem = new MenuItemModel(req.body);

  menuItem
    .save()
    .then(() => res.json(menuItem))
    .catch(next);
}

function putMenuItem(req, res, next) {
  if (!isChangeMenuItemForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  MenuItemModel.findOne({ _id: req.params.idM })
    .then((menuItem: MenuItem) => {
      if (!menuItem) {
        return res.status(404).json(error("MenuItem not found"));
      }

      if (req.body.name) menuItem.name = req.body.name;
      if (req.body.price) menuItem.price = req.body.price;
      if (req.body.preparationTime)
        menuItem.preparationTime = req.body.preparationTime;
      if (req.body.kind) menuItem.kind = req.body.kind;

      menuItem
        .save()
        .then(() => res.send())
        .catch(next);
    })
    .catch(next);
}

function deleteMenuItem(req, res, next) {
  MenuItemModel.findOne({ _id: req.params.idM })
    .then(menuItem => {
      if (!menuItem) {
        return res.status(404).json(error("MenuItem not found"));
      }

      MenuItemModel.deleteOne({ _id: req.params.idM })
        .then(() => res.send())
        .catch(next);
    })
    .catch(next);
}
