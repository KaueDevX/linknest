const { config } = require("dotenv");
const express = require("express");

config();

const app = express();

const Security = require("./middlewares/security");

app.use(Security);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => console.log("ListNest is running!"));
