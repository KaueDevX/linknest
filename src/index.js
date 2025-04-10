const { config } = require("dotenv");
const express = require("express");
const helmet = require("helmet");

config();

const app = express();

const Security = require("./middlewares/security");

app.use(Security);

app.listen(process.env.PORT, () => console.log("ListNest is running!"));
