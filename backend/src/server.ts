import express = require("express");
import cors = require("cors");
import { ioJwtAuth } from "./middlewares/ioJwtAuth";
import { error } from "./helpers/error";
import { createRouter, root } from "./controllers";

export const app = express();

export const server = require("http").Server(app);

export const io = require("socket.io")(server, { path: "/api/v1/events" });

app.use(cors());

app.use(createRouter(root));

app.use("/", express.static(process.env.WWW));

// Error handling middleware
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(error(err.message));
});

app.use((req, res, next) => {
  return res.status(404).json(error("Invalid endpoint"));
});

io.use(ioJwtAuth);

// Greeting event emitter
io.on("connection", socket => {
  socket.emit("greeting", { user: socket.request.user });
});
