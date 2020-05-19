const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  UserID:{
    type: Number,
    unique: true,
    required: true
  },

  First:{
    type: String,
    unique: false,
    required: true
  },
  Last:{
    type: String,
    unique: false,
    required: true
  },
  Email: {
    type: String,
    unique: true,
    required: true,
  },
  Password:{
    type: String,
    unique: false,
    required: true
  },

  //Maybe int instead
  Sessions:{
    type:[Number],
    unique: false,
    required: false
  },

  //ForeignKey, Email or uniqueID
  Friends:{
    type: [String],
    unique: false,
    required: false
  },

  PhoneNumber:{
    type: String,
    unique: true,
    required: false
  },

  //Probably need a settings schema
  Settings:{
    type: [String],
    unique: false,
    required: false
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;