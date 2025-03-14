const mongoose = require("mongoose");

let groupMessagesSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  accountNo: { type: String, required: true },
  Group: { type: String, required: true },
  Message: { type: String, required: true },
  groupKey: { type: String, required: true },
  Time: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
  year: { type: String, required: true },
  fullDate: { type: String, required: true },
  day: { type: String, required: true },
  containsImage: { type: Boolean, required: true },
  imageDimension: { type: Object, required: true },
});

const groupsMessage = new mongoose.model("groupMessages", groupMessagesSchema);

module.exports = groupsMessage;
