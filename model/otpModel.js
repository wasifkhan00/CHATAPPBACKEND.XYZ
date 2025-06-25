const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete in 5 min
});


const otpModel= mongoose.model("Otp", otpSchema);
module.exports = otpModel;