const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: false,
    required: true,
  },

  currentRestaurantIndex: {
    type: Number,
    unique: false,
    required: true,
    default: 0,
  },

  selectedRestaurants: {
    type: [Number],
    unique: false,
    required: true,
    default: [],
  },

  sessionStarted: {
    type: Boolean,
    unique: false,
    required: true,
    default: false,
  },
});

module.exports = MemberSchema;