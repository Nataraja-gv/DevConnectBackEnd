const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose.connect(process.env.MONGO_CONNECTION_SECRET_URL);
};

module.exports = ConnectDB;
