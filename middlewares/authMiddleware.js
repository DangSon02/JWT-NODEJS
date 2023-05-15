const User = require("./../models/userModels");
const jwt = require("jsonwebtoken");
const asynHandler = require("express-async-handler");
exports.authMiddleware = asynHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorization token expired, Please Login Again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});
exports.isAdmin = asynHandler(async (req, res, next) => {
  const email = req.user.email;
  const admin = await User.findOne({ email });
  if (admin.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});
