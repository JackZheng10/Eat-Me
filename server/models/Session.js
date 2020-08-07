const mongoose = require("mongoose");
const RestaurantSchema = require("./schema/RestaurantSchema");
const MemberSchema = require("./schema/MemberSchema");

const SessionSchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
    required: true,
  },

  members: {
    type: [Number],
    unique: false,
    required: true,
  },

  restaurants: {
    type: [RestaurantSchema],
    unique: false,
    required: false,
  },

  members: {
    type: [MemberSchema],
    unique: false,
    required: true,
  },

  //Need to think about all this
  votes: {
    type: [Number],
    unique: false,
    required: false,
    default: [],
  },

  matchedRestaurantIndex: {
    type: Number,
    required: true,
    default: -1,
  },

  status: {
    type: String,
    unique: false,
    required: true,
    default: "No Progress",
  },

  categories: {
    type: [String],
    unique: false,
    required: false,
  },

  streetName: {
    type: [String],
    unique: false,
    required: false,
  },
  latitude: {
    type: Number,
    unique: false,
    required: false,
  },
  longitude: {
    type: Number,
    unique: false,
    required: false,
  },
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
