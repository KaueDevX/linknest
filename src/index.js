const { config } = require("dotenv");
const express = require("express");

config();

const app = express();

const Security = require("./middlewares/security");
const Connection = require("./middlewares/connection");

app.use(Security);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const AuthRouter = require("./routers/auth.routers");

app.use("/api/auth", AuthRouter);

app.listen(process.env.PORT, async () => {
  await Connection();
  console.log("ListNest is running!");
});
