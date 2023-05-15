const jwtToken = require("jsonwebtoken");

exports.generateReFreshToken = (id) => {
  return jwtToken.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
