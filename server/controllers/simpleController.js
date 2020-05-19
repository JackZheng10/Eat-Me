const mongoose = require("mongoose");
const Session = require("../models/Session");
const User = require("../models/User");

const helloWorld = (req, res) => {
  return res.json({ success: true, message: "Hello world!" });
};

const getDB = async (req, res) =>{
	const Users = await User.find();
	const Sessions = await Session.find();
	res.json({
		User: Users,
		Session: Sessions 
	});
}

const deleteDB = async (req, res)=>{
	await User.collection.drop();
	await Session.collection.drop();
	res.json({Status: true, message: "deleteDB"});
}

const getUserSessions = async (req, res)=>{
	let UserSessions = await Session.find({Members: req.body.ID}).lean();
	
	for (let Sesh of UserSessions){
		let MemberNames = [];
		for (let MemberID of Sesh.Members){
			const Member = await User.findOne({UserID: MemberID});
			console.log("Member: " + Member.First);
			MemberNames.push(Member.First + " ");
		}
		Sesh.Members = MemberNames;	
	}

	res.json({Status: true, Sessions: UserSessions});
}

const helloDB = async (req, res)=>{
	let user1 = new User({
		UserID: 1,
		First: "Will",
		Last: "G",
		Email: "abc@123.com",
		Password: "FAKE1",
		Sessions: [1,3],
		Friends: [2,3],
		PhoneNumber: "9547549575",
		Settings: []
	});

	await user1.save();

	let user2 = new User({
		UserID: 2,
		First: "Jack",
		Last: "Z",
		Email: "def@123.com",
		Password: "FAKE2",
		Sessions: [1,2,3],
		Friends: [1,3],
		PhoneNumber: "9549754444",
		Settings: []
	});

	await user2.save();

	let user3 = new User({
		UserID: 3,
		First: "West",
		Last: "H",
		Email: "ghi@123.com",
		Password: "FAKE3",
		Sessions: [2,3],
		Friends: [1,2],
		PhoneNumber: "7549549575",
		Settings: []
	});

	await user3.save();

	let session1 = new Session({
		SessionID: 1,
		Members: [1,2],
		Restauraunts: [],
		Votes: []
	});

	await session1.save();

	let session2 = new Session({
		SessionID: 2,
		Members: [2,3],
		Restauraunts: [],
		Votes: [],
		Status: 'In Progress'
	});

	await session2.save();

	let session3 = new Session({
		SessionID: 3,
		Members: [1,2,3],
		Restauraunts: [],
		Votes: [],
		Status: 'No Match'
	});

	await session3.save();

	res.json({success: true, message: "Hello DB!" });

}

module.exports = { helloWorld, helloDB, getDB, deleteDB, getUserSessions };
