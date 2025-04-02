const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" Invalid Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password Should be Strong");
        }
      },
    },
    photoURL: {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      contentType: { type: String, required: true },
    },

    skills: {
      type: [String],
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{value} is not supported`,
      },
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age must be at most 100"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const verifyPassword = await bcrypt.compare(password, user.password);
  return verifyPassword
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
