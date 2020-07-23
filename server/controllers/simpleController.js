const mongoose = require("mongoose");
const Session = require("../models/Session");
const User = require("../models/User");

const helloWorld = (req, res) => {
	return res.json({ success: true, message: "Hello world!" });
};

const getDB = async (req, res) => {
	const Users = await User.find();
	const Sessions = await Session.find();
	res.json({
		User: Users,
		Session: Sessions,
	});
};

const deleteDB = async (req, res) => {
	await User.collection.drop();
	await Session.collection.drop();
	res.json({ Status: true, message: "deleteDB" });
};

const getUserSessions = async (req, res) => {
	let UserSessions = await Session.find({ Members: req.body.ID }).lean();
	for (let Sesh of UserSessions) {
		let MemberNames = [];
		for (let MemberID of Sesh.Members) {
			const Member = await User.findOne({ ID: MemberID });
			console.log("Member: " + Member.fName);
			MemberNames.push(Member.fName + " ");
		}
		Sesh.Members = MemberNames;
	}

	res.json({ Status: true, Sessions: UserSessions });
};

const helloDB = async (req, res) => {
	let user1 = new User({
		ID: 3,
		fName: "Will",
		lName: "G",
		phone: "9999999999",
		password: "FAKE1",
		sessions: [1, 3],
		friends: [4, 5],
		settings: [],
	});

	await user1.save();

	let user2 = new User({
		ID: 4,
		fName: "Jack",
		lName: "Z",
		phone: "8888888888",
		password: "FAKE2",
		sessions: [1, 2, 3],
		friends: [3, 5],
		settings: [],
	});

	await user2.save();

	let user3 = new User({
		ID: 5,
		fName: "West",
		lName: "H",
		phone: "7777777777",
		password: "FAKE3",
		sessions: [2, 3],
		friends: [3, 4],
		settings: [],
	});

	await user3.save();

	let session1 = new Session({
		SessionID: 1,
		Members: [3, 4],
		Restauraunts: [],
		Votes: [],
	});

	await session1.save();

	let session2 = new Session({
		SessionID: 2,
		Members: [4, 5],
		Restauraunts: [],
		Votes: [],
		Status: "In Progress",
	});

	await session2.save();

	let session3 = new Session({
		SessionID: 3,
		Members: [3, 4, 5],
		Restauraunts: [],
		Votes: [],
		Status: "No Match",
	});

	await session3.save();

	res.json({ success: true, message: "Hello DB!" });
};

module.exports = { helloWorld, helloDB, getDB, deleteDB, getUserSessions };
