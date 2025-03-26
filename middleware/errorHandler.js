const HttpStatusCodes = require("../helpers/statusCodes");

const errorHandler = (err, req, res, next) => {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message || "Internal Server Error" });
  };
  
  module.exports = errorHandler;