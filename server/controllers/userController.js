const { Expo } = require("expo-server-sdk");
const User = require("../models/User");
const signToken = require("../helpers/auth").signToken;
// const SIO = require("../server").SIO;

// Create a new Expo SDK client
const expo = new Expo();

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

//req.body.phone should be the user being operated on, dictated as recipient = res.locals.user when used later on
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
      message: "Error with finding user. Please try again.",
    });
  }
};

const checkExistingRequests = async (req, res, next) => {
  let recipient = res.locals.user;
  let recipientRequests = recipient.friendRequests;
  let recipientFriends = recipient.friends;
  let senderRequests = req.body.senderFriendRequests;

  //use for chunk of chunks syntax, easier
  for (let x = 0; x < recipientRequests.length; x++) {
    if (recipientRequests[x] === req.body.senderID) {
      return res.json({
        success: false,
        message: "You already have a pending friend request to this user.",
      });
    }
  }

  for (let x = 0; x < senderRequests.length; x++) {
    if (senderRequests[x] === recipient.ID) {
      return res.json({
        success: false,
        message:
          "This user has already sent you a friend request. Please accept theirs.",
      });
    }
  }

  for (let x = 0; x < recipientFriends.length; x++) {
    if (recipientFriends[x] === req.body.senderID) {
      return res.json({
        success: false,
        message: "You are already friends with this user.",
      });
    }
  }

  next();
};

const addFriend = async (req, res) => {
  let recipient = res.locals.user;

  if (recipient.ID === req.body.senderID) {
    return res.json({
      success: false,
      message:
        "You cannot send a friend request to yourself. Please try again.",
    });
  }

  try {
    recipient.friendRequests.push(req.body.senderID);
    await recipient.save();

    //why does this work and the const at the top imports doesnt?
    const SIO = require("../server").SIO;

    SIO.of("/api/socket").to(recipient.phone).emit("incomingFriendRequest");

    //push notification testing, hardcoded
    let messages = [
      {
        to: "", //hardcode a token here
        sound: "default",
        body: "This is a test notification",
        data: { withSome: "data" },
      },
    ];

    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }

    return res.json({
      success: true,
      message: "Friend request sent.",
    });
  } catch (error) {
    console.log("Error with assigning friend request: " + error);

    return res.json({
      success: false,
      message:
        "There was an error with sending a friend request. Please try again.",
    });
  }
};

const updateToken = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.query.phone });

    if (user) {
      const token = await signToken(user);

      return res.json({
        success: true,
        message: "Token is attached.",
        token: token,
      });
    } else {
      return res.json({
        success: false,
        message:
          "Error with updating token: user could not be found. Please try again.",
      });
    }
  } catch (error) {
    console.log("Error with updating token: " + error);

    return res.json({
      success: false,
      message: "Error with updating token. Please try again.",
    });
  }
};

const acceptFriend = async (req, res) => {
  try {
    const sender = await User.findOne({ ID: req.body.ID });
    const recipient = res.locals.user;

    recipient.friends.push(req.body.ID);
    recipient.friendRequests = recipient.friendRequests.filter((item) => {
      item !== req.body.ID;
    });

    sender.friends.push(recipient.ID);

    await recipient.save();
    await sender.save();

    const SIO = require("../server").SIO;

    SIO.of("/api/socket").to(recipient.phone).emit("acceptedFriend");
    SIO.of("/api/socket").to(sender.phone).emit("incomingFriend");

    return res.json({
      success: true,
      message: "Friend request accepted.",
    });
  } catch (error) {
    console.log("Error with accepting friend request: " + error);
    return res.json({
      success: false,
      message: "Error with accepting friend request. Please try again.",
    });
  }
};

const declineFriend = async (req, res) => {
  try {
    const recipient = res.locals.user;

    recipient.friendRequests = recipient.friendRequests.filter((item) => {
      item !== req.body.ID;
    });

    await recipient.save();

    const SIO = require("../server").SIO;

    SIO.of("/api/socket").to(recipient.phone).emit("declinedFriend");

    return res.json({
      success: true,
      message: "Friend request declined.",
    });
  } catch (error) {
    console.log("Error with accepting friend request: " + error);
    return res.json({
      success: false,
      message: "Error with accepting friend request. Please try again.",
    });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const sender = await User.findOne({ ID: req.body.ID });
    const recipient = res.locals.user;

    sender.friends = sender.friends.filter((item) => {
      item !== recipient.ID;
    });
    recipient.friends = recipient.friends.filter((item) => {
      item !== req.body.ID;
    });

    await sender.save();
    await recipient.save();

    const SIO = require("../server").SIO;

    SIO.of("/api/socket").to(sender.phone).emit("deletedFriend");
    SIO.of("/api/socket").to(recipient.phone).emit("deletedFriend");

    return res.json({
      success: true,
      message: "Friend removed.",
    });
  } catch (error) {
    console.log("Error with accepting friend request: " + error);
    return res.json({
      success: false,
      message: "Error with accepting friend request. Please try again.",
    });
  }
};

const fetchUsersByID = async (req, res) => {
  try {
    const users = await User.find()
      .where("ID")
      .in(req.body.list)
      .select([
        "-_id",
        "-sessions",
        "-friends",
        "-friendRequests",
        "-settings",
        "-password",
        "-__v",
      ]);

    return res.json({
      success: true,
      message: users,
    });
  } catch (error) {
    console.log("Error with getting user list from IDs: " + error);
    return res.json({
      success: false,
      message: "Error with getting user list from IDs. Please contact us.",
    });
  }
};

module.exports = {
  login,
  checkDuplicatePhone,
  countUsers,
  register,
  findUser,
  checkExistingRequests,
  addFriend,
  updateToken,
  acceptFriend,
  deleteFriend,
  declineFriend,
  fetchUsersByID,
};
