const errorHandler = (err, req, res, next) => {
    console.log('error handler here fucker')
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  };
  
  module.exports = errorHandler;