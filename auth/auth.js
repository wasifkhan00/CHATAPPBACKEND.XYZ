const tokenKey = process.env.Token;//

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token === tokenKey) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = auth;
