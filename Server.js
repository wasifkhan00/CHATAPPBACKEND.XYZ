const express = require("express");
const InsertingData = require("./DB _connection");
const auth = require("./auth");
const mongoose = require("mongoose");
const ServersPORT = process.env.PORT || 3007;
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const SocketServer = http.createServer(app);
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(auth);

let groupInformationSchema = new mongoose.Schema({
  accountNos: { type: String, required: true },
  uniqueGroupKeys: { type: String, required: true },
  groupNames: { type: String, required: true },
  isAdmin: { type: String, required: true },
  addedBy: { type: String, required: true },
  member: { type: Array, required: true },
});

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

const groupsD = new mongoose.model("groupInfos", groupInformationSchema);
const groupsMessage = new mongoose.model("groupMessages", groupMessagesSchema);

groupsD.remove({ _id: { $oid: `${process.env.DB_IDS}` } });
groupsMessage.remove({ _id: { $oid: `${process.env.DB_IDS}` } });

// Socket io
const io = new Server(SocketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("checkGroupUniqueFromDBViaAccountNo", (data) => {
    groupsD.find({ accountNos: data }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          docs.map((users) => {
            socket.join(users.uniqueGroupKeys);
            socket.emit("checkingAdmin", users);
          });
        }
      }
    });
  });

  socket.on("userJoined", (data) => {
    socket.join(data);
  });

  socket.on("userLeftTheGroup", (data) => {
    socket.to(data.groupKey).emit("userHasLeftGroup", data);
  });

  socket.on("userTyping", (data) => {
    socket.to(data.groupKey).emit("userIsTyping", data);
  });

  socket.on("userStoppedTyping", (data) => {
    socket.to(data.groupKey).emit("userHasStoppedTyping", data);
  });

  socket.on("sendMessage", (data) => {
    const {
      Name,
      accountNo,
      Group,
      Message,
      groupKey,
      Time,
      date,
      year,
      month,
      fullDate,
      day,
      containsImage,
      imageDimension,
    } = data.Message_Data;

    const savingMessages = new groupsMessage({
      Name: Name,
      accountNo: accountNo,
      Group: Group,
      Message: Message,
      groupKey: groupKey,
      Time: Time,
      month: month,
      date: date,
      year: year,
      fullDate: fullDate,
      day: day,
      containsImage: containsImage,
      imageDimension: imageDimension,
    });

    savingMessages.save();

    socket.to(data.Message_Data.groupKey).emit("rcvMsg", data);
  });

  socket.on("disconnect", (data) => {
    console.log("Connection Interuppted");
  });
});

// Socket io End
app.get("/", async (req, res) => {res.send('okay')})

try {
  app.post("/register", async (req, res) => {
    const { name, account, password } = req.body;

    InsertingData.find({ accounts: account }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (!docs.length > 0) {
          res.send("Account Successfully Registered");

          const dataToDB = new InsertingData({
            names: name,
            accounts: account,
            passwords: password,
          });

          dataToDB.save();
        } else {
          res.send("Account already exists");
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/groupInformation", (req, res) => {
    const { accountNo, uniqueGroupKey, groupName, isAdmin, members, AddedBy } =
      req.body;

    groupsD.find({ accountNos: accountNo }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          res.send("Account number found");
        } else {
          res.send("Account number not found");

          const groupDataToDB = new groupsD({
            accountNos: accountNo,
            uniqueGroupKeys: uniqueGroupKey,
            groupNames: groupName,
            isAdmin: isAdmin,
            member: members,
            addedBy: AddedBy,
          });
          groupDataToDB.save();
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/groupInformationz", (req, res) => {
    const { userAccountNo } = req.body;

    groupsD.find({ accountNos: userAccountNo }, { _id: 0 }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          res.send(docs);
        } else {
          res.send("Couldnt FInd the group info");
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.get("/EveryGroupsData", (req, res) => {
    groupsD.find({}, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          res.send(docs);
        } else {
          res.send("There are no groups Created yet");
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/groupInformationForGroupMemberCheck", (req, res) => {
    const { userAccountNo } = req.body;

    groupsD.find({ accountNos: userAccountNo }, { _id: 0 }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          res.send(docs);
        } else {
          res.send("Couldnt FInd the group info");
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/login", (req, res) => {
    const { account, password } = req.body;

    InsertingData.find(
      { accounts: account, passwords: password },
      (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs.length > 0) {
            res.send(docs);
          } else {
            res.send("Account no or Password not found");
          }
        }
      }
    );
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/checkForGroupNames", (req, res) => {
    const { groupMembersInputValue } = req.body;

    if (groupMembersInputValue !== "") {
      InsertingData.find(
        { accounts: { $regex: groupMembersInputValue } },
        (err, docs) => {
          if (err) {
            throw Error(err.message);
          } else {
            if (docs.length > 0) {
              res.send(docs);
            } else {
              res.send("Account doesn't exists");
            }
          }
        }
      );
    } else {
      res.sendStatus(404);
    }
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.put("/updateGroupMembersArray", async (req, res) => {
    const { uniqueGroupKey, members, accountNo } = req.body;

    if (uniqueGroupKey !== "") {
      const result = await groupsD.updateMany(
        { uniqueGroupKeys: uniqueGroupKey },
        {
          $set: {
            member: members,
          },
        }
      );
    }
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.put("/updateGroupName", async (req, res) => {
    const { uniqueGroupKey, groupNames } = req.body;

    if (uniqueGroupKey !== "") {
      const result = await groupsD.updateMany(
        { uniqueGroupKeys: uniqueGroupKey },
        {
          $set: {
            groupNames: groupNames,
          },
        }
      );
    }
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.delete("/groupleaving", (req, res) => {
    const { groupKey, userAccountNo } = req.body;

    groupsD.find({ uniqueGroupKeys: groupKey }, { _id: 0 }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          docs.map(async (users) => {
            if (users.accountNos === userAccountNo) {
              groupsD
                .deleteOne({ accountNos: userAccountNo })
                .then(() => {
                  res.send({
                    userAccountNo: userAccountNo,
                    message: `User left`,
                    groupKey: groupKey,
                  });
                })
                .catch((error) => {
                  throw Error(error.message);
                });
            }

            if (users.uniqueGroupKeys === groupKey) {
              const result = await groupsD.updateMany(
                { uniqueGroupKeys: groupKey },
                {
                  $pull: {
                    member: userAccountNo,
                  },
                }
              );
            }
          });
        } else {
          res.send("Couldnt FInd the group info");
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.delete("/groupDeletion", (req, res) => {
    const { groupKey, isAdmin } = req.body;

    groupsD.deleteMany({ uniqueGroupKeys: groupKey }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs) {
          res.send("group Deleted");

          groupsMessage.deleteMany({ groupKey: groupKey }, (err, docs) => {
            if (err) {
              throw Error(err.message);
            } else {
              if (docs) {
                console.log("User Successfully Deleted the Group");
              }
            }
          });
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

try {
  app.post("/fetchMessages", (req, res) => {
    const { uniqueGroupKey } = req.body;

    groupsMessage.find({ groupKey: uniqueGroupKey }, (err, docs) => {
      if (err) {
        throw Error(err.message);
      } else {
        if (docs.length > 0) {
          res.send(docs);
        } else {
          res.sendStatus(404);
        }
      }
    });
  });
} catch (error) {
  throw Error(error.message);
}

server.listen(ServersPORT, () => {
  console.log(`Your Server & Socket is Running on ${ServersPORT}`);
});
