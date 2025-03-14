const mongoose = require("mongoose");
const colors = require("../helpers/colorCodes");

const connectToDB = async (dbConnectionURI) => {
  try {
    await mongoose
      .connect(dbConnectionURI)
      .then((res) => console.log(colors.magenta,"Server connected to the database from seperate module"))
      .catch((er) => {
        throw Error(er.message);
      });
  } catch (error) {
    throw Error(error.message);
  }
};

module.exports = connectToDB;
