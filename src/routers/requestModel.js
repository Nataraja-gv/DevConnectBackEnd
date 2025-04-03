const express = require("express");
const userAuth = require("../utils/userAuth");
const User = require("../models/userModels");
const ConnectionModel = require("../models/connectionModels");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const fromUserId = req.user;
      const toUserId = req.params.toUserId;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error(`invalid ${status} status type`);
      }

      const existingToUser = await User.findById({ _id: toUserId });
      if (!existingToUser) {
        throw new Error("invalid requested id");
      }

      const existingRequest = await ConnectionModel.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (existingRequest) {
        throw new Error("connection request already");
      }

      const response = await ConnectionModel({
        fromUserId: fromUserId._id,
        toUserId,
        status,
      });

      const data = await response.save();

      res.status(200).json({
        message: `${fromUserId.name} ${status} the ${existingToUser.name}`,
        data: data,
      });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInuser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error(`invalid ${status} status type`);
      }

      const connectionRequest = await ConnectionModel.findOne({
        toUserId: loggedInuser._id,
        _id: requestId,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("invalid connection request");
      }
      connectionRequest.status = status;
      await connectionRequest.save();

      const response = await ConnectionModel.findById(connectionRequest._id).populate("fromUserId", "name");
      res
        .status(200)
        .json({
          message: `${loggedInuser.name} ${status} the ${response.fromUserId.name}`,
          data: response,
        });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
