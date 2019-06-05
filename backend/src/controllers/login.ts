import jsonwebtoken = require("jsonwebtoken");
import { basicAuth } from "../middlewares/basicAuth";
import { Route } from ".";

function signToken(req, res) {
  const data = {
    _id: req.user._id,
    username: req.user.username,
    name: req.user.name,
    surname: req.user.surname,
    role: req.user.role
  };

  const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, {
    expiresIn: "12h"
  });

  return res.json({ token: token });
}

export const login: Route = {
  path: "/login",
  POST: { middlewares: [basicAuth], callback: signToken }
};
