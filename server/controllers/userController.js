const mongoose = require("mongoose");
const User = require("../models/User");
const signToken = require("../helpers/auth").signToken;

const pusherAppID =
  process.env.PUSHER_APP_ID || require("../config/config").pusher.appID;
const pusherKey =
  process.env.PUSHER_KEY || require("../config/config").pusher.key;
const pusherSecret =
  process.env.PUSHER_SECRET || require("../config/config").pusher.secret;
const pusherCluster =
  process.env.PUSHER_CLUSTER || require("../config/config").pusher.cluster;

//pusher testing
var Pusher = require("pusher");

var pusher = new Pusher({
  appId: pusherAppID,
  key: pusherKey,
  secret: pusherSecret,
  cluster: pusherCluster,
  useTLS: true,
});

const login = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });

    if (!user || !user.validPassword(req.body.password)) {
      return res.json({
        success: false,
        message: "Invalid login. Please try again.",
      });
    } else {
      //granting access to the token, the information for current user
      const token = await signToken(user);

      return res.json({
        success: true,
        message: "Successfully logged in, token is attached.",
        token: token,
      });
    }
  } catch (error) {
    console.log("Error with logging in: " + error);

    return res.json({
      success: false,
      message: "Error with logging in. Please try again.",
    });
  }
};

const checkDuplicatePhone = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.query.phone });

    if (user) {
      return res.json({
        success: false,
        message:
          "Phone number already in use. Please enter a new one and try again.",
      });
    } else {
      return res.json({
        success: true,
        message: "Phone number not in use.",
      });
    }
  } catch (error) {
    console.log("Error with checking duplicate phone number: " + error);

    return res.json({
      success: false,
      message: "Error with checking duplicate phone number. Please try again.",
    });
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
    console.log("Error with counting users: " + error);

    return res.json({
      success: false,
      message: "Error with registration. Please try again.",
    });
  }
};

const register = async (req, res) => {
  try {
    const user = await User.create({
      ID: res.locals.count + 1,
      fName: req.body.fName,
      lName: req.body.lName,
      phone: req.body.phone,
      password: req.body.password,
    });

    return res.json({
      success: true,
      message: "Successfully registered! Please log in to continue.",
    });
  } catch (error) {
    console.log("Error with registering: " + error);

    return res.json({
      success: false,
      message: "Error with registration. Please try again.",
    });
  }
};

const findUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });

    if (user) {
      res.locals.user = user;
      next();
    } else {
      return res.json({
        success: false,
        message: "User could not be found. Please try again.",
      });
    }
  } catch (error) {
    console.log("Error with finding user: " + error);

    return res.json({
      success: false,
      message: "Error with adding friend. Please try again.",
    });
  }
};

const addFriend = async (req, res) => {
  //normal pusher
  // pusher.trigger("testChannel", "testEvent", {
  //   message: "hello world",
  // });

  return res.json({
    success: true,
    message: "This is a test message, but good job getting here.",
  });
};

module.exports = {
  login,
  checkDuplicatePhone,
  countUsers,
  register,
  findUser,
  addFriend,
};
