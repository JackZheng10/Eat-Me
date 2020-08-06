const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  //May be provided by default
  ID: {
    type: String,
    unique: true,
    required: true,
  },

  images: {
    type: [String],
    unique: false,
  },

  //Figure out how to store hours
  hours: {
    type: Number,
    unique: false,
    required: false,
  },

  //Need to think about all this
  name: {
    type: String,
    unique: false,
    required: false,
  },

  rating: {
    type: Number,
    unique: false,
  },

  transactions: {
    type: [String],
    unique: false,
    required: false,
  },

  url: {
    type: [String],
    unique: false,
    required: false,
  },
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
