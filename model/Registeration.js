const mongoose = require("mongoose");

let chatAppSchema = new mongoose.Schema({
  names: { type: String, required: true },
  accounts: { type: String, required: true },
  passwords: { type: String, required: true, select: false },
});

const InsertingData = new mongoose.model("registerations", chatAppSchema, "registerations");

module.exports = InsertingData;
