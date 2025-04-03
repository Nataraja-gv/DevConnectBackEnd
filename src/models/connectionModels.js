const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "value incorrect type",
      },
      required: true,
    },
  },
  { timestamps: true }
);

const ConnectionModel = mongoose.model("connections", connectionSchema);

module.exports = ConnectionModel;
