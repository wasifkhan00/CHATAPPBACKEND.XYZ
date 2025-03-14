const { Server } = require("socket.io");
const groupsD = require("../model/groupDetails");
const groupsMessage = require("../model/message");

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("checkGroupUniqueFromDBViaAccountNo", async (data) => {
      try {
        const docs = await groupsD.find({ accountNos: data }).exec();
        if (docs.length > 0) {
          docs.forEach((users) => {
            socket.join(users.uniqueGroupKeys);
            socket.emit("checkingAdmin", users);
          });
        }
      } catch (err) {
        console.error("Error checking group uniqueness:", err.message);
      }
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

    socket.on("sendMessage", async (data) => {
      try {
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
          Name,
          accountNo,
          Group,
          Message,
          groupKey,
          Time,
          month,
          date,
          year,
          fullDate,
          day,
          containsImage,
          imageDimension,
        });

        await savingMessages.save();

        socket.to(data.Message_Data.groupKey).emit("rcvMsg", data);
      } catch (err) {
        console.error("Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Connection Interrupted");
    });
  });
};

module.exports = socketSetup;
