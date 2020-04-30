const jwt = require("jsonwebtoken");
const config = require("config");

/**
 *
 * decoded token contains
 * payload: {user:id}
 */

module.exports = function(req, res, next) {
  try {
    let token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "token missing" });
    }
    let decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    return next();
  } catch (e) {
    res.status(401).json({ msg: "token expired" });
  }
};
