const express = require("express");
const ValidationForm = require("../middleware/validation");
const uploads = require("../component/uploadsfile");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post(
  "/auth/signup",
  uploads.single("photoURL"),
  async (req, res) => {
    try {
      ValidationForm(req);
      const { name, email, password, age, gender, skills } = req.body;

      if (!req.file) {
        throw new Error("photo URl is required");
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        throw new Error("User already Exist");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const PhotoData = {
        filename: req.file.filename,
        path: `http://localhost:7777/src/uploads/${req.file.filename}`,
        contentType: req.file.mimetype,
      };

      const data = {
        name,
        email,
        password: passwordHash,
        age,
        gender,
        skills,
        photoURL: PhotoData,
      };
      const user = new User(data);
      const response = await user.save();
      const token = await response.getJWT();
      res.cookie("token", token);
      res.status(200).json({ message: `${name} Details `, data: response });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not found!!.please sign up");
    }

    const verfilyPassword = await user.verifyPassword(password);
    if (!verfilyPassword) {
      throw new Error(" inValid Credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.status(200).json({ message: `${user.name} details`, data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/auth/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({message:"logout successfully"})
});

module.exports = authRouter;
