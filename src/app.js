const express = require("express");
const ConnectDB = require("./config/database");
const authRouter = require("./routers/authRouter");
const profileRouter = require("./routers/profileRouter");

const cookieParser = require('cookie-parser')

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter);
app.use("/", profileRouter);

ConnectDB()
  .then(() => {
    console.log("data connected Sucessfully");
    app.listen(process.env.PORT, () => {
      console.log("Server Running on 7777");
    });
  })
  .catch((error) => {
    console.log(`DB not connected ${error.message}`);
  });
