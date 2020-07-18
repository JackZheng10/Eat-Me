const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: false,
    required: true,
  },
  fName: {
    type: String,
    unique: false,
    required: true,
  },
  lName: {
    type: String,
    unique: false,
    required: true,
  },
});

module.exports = FriendRequestSchema;
