const { config } = require("dotenv");
const mongoose = require("mongoose");

config();

const mongoUrl = process.env.MONGO_URL || "";

const connection = async function connection() {
  if (mongoUrl == "") return new Error("Get URL MongoDB");
  try {
    await mongoose.connect(mongoUrl);
    console.log("🟢 | Conexão concluída com êxito.");
  } catch (error) {
    console.log("🔴 | Erro ao conectar ao MongoDB.");
    console.error("Erro de conexão:", error);
  }
};

module.exports = connection;
