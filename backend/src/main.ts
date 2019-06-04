require("./config");
import mongoose = require("mongoose");
import { server } from "./server";

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  });
  console.log("Connected to MongoDB");

  server.listen(parseInt(process.env.SERVER_PORT), () => {
    console.log("Listening on port " + process.env.SERVER_PORT);
  });
})();
