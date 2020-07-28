const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
	//May be provided by default
	ID: {
		type: String,
		unique: true,
		required: true,
	},

	//Name or ID
	members: {
		type: [Number],
		unique: false,
		required: true,
	},

	//Maybe IDNum instead of String
	//Maybe separate restaraunt schema instead of string with votes attached
	restaurants: {
		type: [String],
		unique: false, //Maybe
		required: false,
	},

	//Need to think about all this
	votes: {
		type: [String],
		unique: false,
		required: false,
	},

	status: {
		type: String,
		unique: false,
		required: true,
		default: "No Progress",
	},

	categories: {
		type: [String],
		unique: false,
		required: false,
	},

	streetName: {
		type: [String],
		unique: false,
		required: false,
	},
	latitude: {
		type: Number,
		unique: false,
		required: false,
	},
	longitude: {
		type: Number,
		unique: false,
		required: false,
	},
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
