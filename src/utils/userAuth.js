const JWT = require("jsonwebtoken");
const User = require("../models/userModels");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: "Please login" });
  }
  const decodedId = await JWT.verify(token, process.env.JWT_SECRET);
  const { _id } = decodedId;

  const user = await User.findById(_id);

  if (!user) {
    throw new Error("invalid user");
  }
  req.user = user;

  next();
};

module.exports = userAuth;
