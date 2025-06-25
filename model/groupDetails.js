const mongoose = require("mongoose");

let groupInformationSchema = new mongoose.Schema({
  emails: { type: String, required: true },
  uniqueGroupKeys: { type: String, required: true },
  groupNames: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  addedBy: { type: String, required: true },
  member: { type: Array, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatGroupInfo = new mongoose.model("groupInfos", groupInformationSchema);

module.exports = chatGroupInfo;
