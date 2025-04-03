const express = require("express");
const userAuth = require("../utils/userAuth");
const ConnectionModel = require("../models/connectionModels");
const User = require("../models/userModels");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId");

    res.status(200).json({
      message: `${loggedInUser.name}  have follow the request`,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/received/connections", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequest = await ConnectionModel.find({
      toUserId: loggedInuser._id,
      status: "accepted",
    })
      .select("fromUserId")
      .populate("fromUserId");

    res.status(200).json({
      message: `${loggedInuser.name} all connection feeds`,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/users/feeds", userAuth, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit || 2);
    const page = parseInt(req.query.page || 1);
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeeds = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeeds.add(req.fromUserId.toString());
      hideUserFromFeeds.add(req.toUserId.toString());
    });
    const feedResponse = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeeds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ message: "all feed Details", data: feedResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
