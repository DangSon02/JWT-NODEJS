const jwtToken = require("jsonwebtoken");

exports.generateToken = (id) => {
  return jwtToken.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
