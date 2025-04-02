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
      enum: ["interested", "requested", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

const ConnectionModel = mongoose.model("connections", connectionSchema);

module.exports = ConnectionModel;
