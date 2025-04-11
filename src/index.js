const { config } = require("dotenv");
const express = require("express");

config();

const app = express();

const Security = require("./middlewares/security");
const Connection = require("./middlewares/connection");

app.use(Security);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const AuthRouter = require("./routes/auth.routes");
const UserRouter = require("./routes/user.routes");
const LinkRouter = require("./routes/link.routes");

app.use("/api/link", LinkRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(process.env.PORT, async () => {
  await Connection();
  console.log("ListNest is running!");
});
