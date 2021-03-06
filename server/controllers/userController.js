const User = require("../models/User");
const Session = require("../models/Session");
const { addRestaurantsToSession } = require("../helpers/sessionHelper");
const signToken = require("../helpers/auth").signToken;
const sendPushNotification = require("../helpers/pushNotifications")
  .sendPushNotification;
// const SIO = require("../server").SIO;

//todo: maybe separate some of these into another controller - session controller?

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
    console.log("Error with logging in: ", error);

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
    console.log("Error with checking duplicate phone number: ", error);

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
    console.log("Error with counting users: ", error);

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
    console.log("Error with registering: ", error);

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
    console.log("Error with finding user: ", error);

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

  //todo: use for chunk of chunks syntax, easier
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

    sendPushNotification(
      recipient.pushToken,
      `You've received a friend request from ${req.body.senderName}`
    );

    return res.json({
      success: true,
      message: "Friend request sent.",
    });
  } catch (error) {
    console.log("Error with assigning friend request: ", error);

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
    console.log("Error with updating token: ", error);

    return res.json({
      success: false,
      message: "Error with updating token.",
    });
  }
};

const acceptFriend = async (req, res) => {
  try {
    const sender = await User.findOne({ ID: req.body.ID });
    const recipient = res.locals.user;

    sender.friends.push(recipient.ID);

    recipient.friends.push(req.body.ID);
    recipient.friendRequests = recipient.friendRequests.filter((item) => {
      item !== req.body.ID;
    });

    await sender.save();
    await recipient.save();

    const SIO = require("../server").SIO;

    SIO.of("/api/socket").to(recipient.phone).emit("acceptedFriend");
    SIO.of("/api/socket").to(sender.phone).emit("incomingFriend");

    sendPushNotification(
      sender.pushToken,
      `You're now friends with ${recipient.fName} ${recipient.lName}`
    );

    return res.json({
      success: true,
      message: "Friend request accepted.",
    });
  } catch (error) {
    console.log("Error with accepting friend request: ", error);
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
    console.log("Error with accepting friend request: ", error);
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
    console.log("Error with accepting friend request: ", error);
    return res.json({
      success: false,
      message: "Error with accepting friend request. Please try again.",
    });
  }
};

const getUsersByID = async (req, res) => {
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
    console.log("Error with getting user list from IDs: ", error);
    return res.json({
      success: false,
      message: "Error with getting user list from IDs. Please contact us.",
    });
  }
};

const updatePushToken = async (req, res) => {
  try {
    const recipient = res.locals.user;
    const token = req.body.pushToken;

    //if the token is different, update it and return that fact
    if (recipient.pushToken !== token) {
      recipient.pushToken = token;
      await recipient.save();

      return res.json({
        success: true,
        message: "updated",
      });
    }

    return res.json({
      success: true,
      message: "unchanged",
    });
  } catch (error) {
    return res.json({
      success: false,
      message:
        "Error with updating push notification token. Please try again later.",
    });
  }
};

const updateName = async (req, res) => {
  try {
    let recipient = res.locals.user;

    if (
      recipient.fName === req.body.fName &&
      recipient.lName === req.body.lName
    ) {
      return res.json({
        success: false,
        message: "Please enter an updated name.",
      });
    }

    recipient.fName = req.body.fName;
    recipient.lName = req.body.lName;

    await recipient.save();

    //dont forget to update token in frontend upon success
    return res.json({
      success: true,
      message: "Name successfully updated.",
    });
  } catch (error) {
    console.log("Error with updating name in server: ", error); //todo: better way to handle server/client errors?
    return res.json({
      success: false,
      message: "Error with updating name. Please contact us. Error code: 5", //todo: better way to handle server/client errors? so we can tell where it failed easily
    });
  }
};

const updatePhone = async (req, res) => {
  try {
    let recipient = res.locals.user;
    recipient.phone = req.body.newPhone;

    await recipient.save();

    return res.json({
      success: true,
      message: "Phone successfully updated.",
    });
  } catch (error) {
    console.log("Error with updating phone in server: ", error);
    return res.json({
      success: false,
      message:
        "Error with updating phone. Please contact us. Error code: example",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    let recipient = res.locals.user;

    //not needed since at pre-save, it's already hashed
    // recipient.password = recipient.generateHash(req.body.newPassword);
    recipient.password = req.body.newPassword;

    await recipient.save();

    return res.json({
      success: true,
      message: "Password successfully updated.",
    });
  } catch (error) {
    console.log("Error with updating password in server: ", error);
    return res.json({
      success: false,
      message:
        "Error with updating password. Please contact us. Error code: example",
    });
  }
};

const getUserSessions = async (req, res) => {
  try {
    let userSessions = await Session.find({ "members.userID": req.body.ID })
      .select("ID members matchedRestaurantIndex")
      .lean();

    for (let userSession of userSessions) {
      const membersIDs = userSession.members.map((member) => member.userID);
      userSession.membersNames = await getUsersNameByID(membersIDs);
    }

    res.json({ success: true, sessions: userSessions });
  } catch (error) {
    console.log("Error retrieving user sessions:  " + error);
    res.json({ success: false, error });
  }
};

//Duplicate of getUsersByID but I only get name for now,
//maybe move this method elsewhere no so directly related to userController
const getUsersNameByID = async (userIDs) => {
  const userNames = Promise.all(
    userIDs.map(async (ID) => {
      const user = await User.findOne({ ID });
      return user.fName;
    })
  );

  return userNames;
};

const createSession = async (req, res) => {
  const { currentUser } = req.body;
  const {
    sessionCategories,
    sessionLocation,
    sessionFriends,
  } = req.body.sessionConfigurables;

  const sessionUsers = [currentUser, ...sessionFriends];

  const members = sessionUsers.map((user) => {
    return {
      userID: user.ID,
    };
  });

  const membersIDs = sessionUsers.map((member) => member.ID);

  //Convert Category objects to array of strings only
  const sessionCategoryCodes = sessionCategories.map((category) => {
    return category.code;
  });

  try {
    const count = await Session.countDocuments();

    let newSession = new Session({
      ID: count + 1,
      categories: sessionCategoryCodes,
      latitude: sessionLocation.latitude,
      longitude: sessionLocation.longitude,
      streetName: sessionLocation.address,
      members,
    });

    addSessionToUsers(newSession.ID, sessionUsers);

    await newSession.save();

    const membersNames = await getUsersNameByID(membersIDs);

    const userSession = { ...newSession.toObject(), membersNames };

    res.json({ success: true, userSession });

    //Save Restaurants after sending back response
    await addRestaurantsToSession(
      sessionCategoryCodes,
      sessionLocation,
      userSession.ID
    );
  } catch (error) {
    console.log("Error creating session: " + error);
    res.json({ success: false, error });
  }
};

const addSessionToUsers = (sessionID, users) => {
  users.forEach(async (user) => {
    await User.updateOne({ ID: user.ID }, { $push: { sessions: sessionID } });
  });
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
  getUsersByID,
  updatePushToken,
  getUserSessions,
  createSession,
  addSessionToUsers,
  updateName,
  updatePhone,
  updatePassword,
};
