const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

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
  // email: {
  //   type: String,
  //   unique: true,
  //   required: true,
  // },
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

//the following password methods need to be before "const User..."
//adds method to user to create hashed password
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

//adds method to user to check if password is correct
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//had to add this, checks if password was changed before saving
//before user saved in db
UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = this.generateHash(this.password);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
