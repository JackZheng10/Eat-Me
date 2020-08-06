const mongoose = require("mongoose");
const Session = require("../models/Session");
const User = require("../models/User");

const helloWorld = (req, res) => {
  return res.json({ success: true, message: "Hello world!" });
};

const getDB = async (req, res) => {
  const users = await User.find();
  const sessions = await Session.find();
  res.json({
    users,
    sessions,
  });
};

const deleteDB = async (req, res) => {
  await User.collection.drop();
  await Session.collection.drop();
  res.json({ Status: true, message: "deleteDB" });
};

const helloDB = async (req, res) => {
  //sessions: [1, 3]
  let user1 = new User({
    ID: 3,
    fName: "Will",
    lName: "G",
    phone: "9999999999",
    password: "FAKE1",
    sessions: [],
    friends: [4, 5],
    settings: [],
  });

  await user1.save();

  //sessions: [1, 2, 3],
  let user2 = new User({
    ID: 4,
    fName: "Jack",
    lName: "Z",
    phone: "8888888888",
    password: "FAKE2",
    sessions: [],
    friends: [3, 5],
    settings: [],
  });

  await user2.save();

  //sessions: [2, 3],
  let user3 = new User({
    ID: 5,
    fName: "West",
    lName: "H",
    phone: "7777777777",
    password: "FAKE3",
    sessions: [],
    friends: [3, 4],
    settings: [],
  });

  await user3.save();

  let session1 = new Session({
    ID: 1,
    members: [3, 4],
    restaurants: [],
    votes: [],
    categories: ["bbq", "tradamerican"],
    latitude: 26.075567152869752,
    longitude: -80.22537589511568,
  });

  //await session1.save();

  let session2 = new Session({
    ID: 2,
    members: [4, 5],
    restaurants: [],
    votes: [],
    status: "In Progress",
    categories: ["pizza", "italian"],
    latitude: 26.075567152869752,
    longitude: -80.22537589511568,
  });

  //await session2.save();

  let session3 = new Session({
    ID: 3,
    members: [3, 4, 5],
    restaurants: [],
    votes: [],
    status: "No Match",
    categories: ["chinese", "latin"],
    latitude: 26.075567152869752,
    longitude: -80.22537589511568,
  });

  //await session3.save();

  res.json({ success: true, message: "Hello DB!" });
};

module.exports = { helloWorld, helloDB, getDB, deleteDB };
