const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  ID: {
    type: Number,
    unique: true,
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
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  //Maybe int instead
  Sessions: {
    type: [Number],
    unique: false,
    required: true,
    default: [],
  },
  //ForeignKey, Email or uniqueID
  Friends: {
    type: [String],
    unique: false,
    required: true,
    default: [],
  },
  //Probably need a settings schema
  Settings: {
    type: [String],
    unique: false,
    required: true,
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
