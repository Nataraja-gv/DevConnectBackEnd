const express = require("express");
const userAuth = require("../utils/userAuth");
const ValidFieldRequest = require("../component/validfields");
const uploads = require("../component/uploadsfile");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res
        .status(200)
        .json({ message: `${user.name} Full Details`, data: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  uploads.single("photoURL"),
  async (req, res) => {
    try {
      if (!ValidFieldRequest(req)) {
        throw new Error("invalid edit field");
      }
      const { name, age, gender, skills, photoURL } = req.body;
      let photourl;
      if (req.file) {
        photourl = {
          filename: req.file.filename,
          path: `http://localhost:7777/src/uploads/${req.file.filename}`,
          contentType: req.file.mimetype,
        };
      }

      const user = req.user;

      const data = {
        name,
        age,
        gender,
        skills,
        photoURL: photourl || photoURL,
      };

      const response = await User.findByIdAndUpdate({ _id: user._id }, data, {
        new: true,
      });

      res.status(200).json({
        message: `${response.name} data updated successfully`,
        data: response,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = req.user;
    const verifyPassword = await user.verifyPassword(oldPassword);

    if (!verifyPassword) {
      throw new Error("invalid old password");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;
    await user.save();
    res.status(200).json({ message: `${user.name} updated the password` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
