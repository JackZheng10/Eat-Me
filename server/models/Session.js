const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
	//May be provided by default
	SessionID: {
		type: String,
		unique: true,
		required: true,
	},

	//Name or ID
	Members: {
		type: [Number],
		unique: false,
		required: true,
	},

	//Maybe IDNum instead of String
	//Maybe separate restaraunt schema instead of string with votes attached
	Restauraunts: {
		type: [String],
		unique: false, //Maybe
		required: false,
	},

	//Need to think about all this
	Votes: {
		type: [String],
		unique: false,
		required: false,
	},

	Status: {
		type: String,
		unique: false,
		required: true,
		default: "No Progress",
	},

	Categories: {
		type: [String],
		unique: false,
		required: false,
	},

	LocationName: {
		type: [String],
		unique: false,
		required: false,
	},
	LocationLatitude: {
		type: Number,
		unique: false,
		required: false,
	},
	LocationLongitude: {
		type: Number,
		unique: false,
		required: false,
	},
});

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
