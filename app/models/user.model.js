const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      max: [127, "Max Length is 127 characters"],
    },
    email: {
      type: String,
      required: true,
      max: [127, "Max Length is 127 characters"],
    },
    password: {
      type: String,
      required: true,
      max: [127, "Max Length is 127 characters"],
    },
    fullName: String,
    phone: String,
    email_verified: Boolean,
    last_seen: Date,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
