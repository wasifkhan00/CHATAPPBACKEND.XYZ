const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

const db = process.env.DB_CONNECTION_STRING;//


try {
  mongoose
    .connect(db)
    .then((res) => console.log("Server connected to the database"))
    .catch((er) => {
      throw Error(er.message);
    });
} catch (error) {
  throw Error(error.message);
}

let chatAppSchema = new mongoose.Schema({
  names: { type: String, required: true },
  accounts: { type: String, required: true },
  passwords: { type: String, required: true, select: false },
});

const InsertingData = new mongoose.model("registerations", chatAppSchema);

InsertingData.remove({ _id: { $oid: "4d513345cc9374271b02ec6c" } });

module.exports = InsertingData;
