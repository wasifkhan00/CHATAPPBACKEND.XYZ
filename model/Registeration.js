const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let chatAppSchema = new mongoose.Schema({
  names: { type: String, required: true },
  emails: { type: String, required: true },
  passwords: { type: String, required: true, select: false },
  verifiedEmail: {
  type: Boolean,
  default: false
},
  createdAt: { type: Date, default: Date.now },
});

chatAppSchema.pre("save", async function (next) {
  if (!this.isModified("passwords")) return next();

  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(this.passwords, saltRounds);
    this.passwords = hashed;
    next();
  } catch (err) {
    return next(err);
  }
});

const userRegisteration = mongoose.model(
  "registerations",
  chatAppSchema,
  "registerations"
);

module.exports = userRegisteration;
