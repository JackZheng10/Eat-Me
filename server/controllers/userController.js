const mongoose = require("mongoose");
const User = require("../models/User");

const login = (req, res) => {
  console.log(2);
  return res.json({ success: true, message: "Hello world!" });
};

const checkDuplicatePhone = async (req, res, next) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });

    if (user) {
      return res.json({
        success: false,
        message:
          "Duplicate phone number. Please enter a new one and try again.",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error._message });
  }
};

const countUsers = async (req, res, next) => {
  try {
    const count = await User.countDocuments();

    if (count) {
      res.locals.count = count;
    } else {
      res.locals.count = 0;
    }

    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error._message });
  }
};

const register = async (req, res) => {
  try {
    const registeredUser = await User.create({
      ID: res.locals.count + 1,
      fName: req.body.fName,
      lName: req.body.lName,
      phone: req.body.phone,
      password: req.body.password,
    });

    return res.json({ success: true, message: "Successfully registered!" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error._message });
  }
};

module.exports = { login, checkDuplicatePhone, countUsers, register };
