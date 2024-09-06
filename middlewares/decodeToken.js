const JWT = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const decodeToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  try {
    const user = JWT.verify(token, JWT_SECRET_KEY);
    req.user = user.userID;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = decodeToken;
