  const mongoose = require("mongoose");

  let groupInformationSchema = new mongoose.Schema({
    accountNos: { type: String, required: true },
    uniqueGroupKeys: { type: String, required: true },
    groupNames: { type: String, required: true },
    isAdmin: { type: String, required: true },
    addedBy: { type: String, required: true },
    member: { type: Array, required: true },
  });

  const chatGroupInfo = new mongoose.model("groupInfos", groupInformationSchema);

  module.exports = chatGroupInfo;
