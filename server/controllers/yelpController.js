const mongoose = require("mongoose");
const Session = require("../models/Session");
const { yelp } = require("./apis/yelp");

const getRestaurantCategories = async (req, res) => {
	try {
		const categories = await yelp.get("/categories");
		res.json(categories.data);
	} catch (error) {
		//How i think error handling shoould be instead of chain statements
		console.log(error);
	}
};

const getRestaurantInfo = async (req, res) => {
	const businessURL = `/businesses/${req.body.restaurantID}`;
	try {
		const restaurauntInfo = await yelp.get(businessURL);
		res.json(restaurauntInfo.data);
	} catch (error) {}
};

const searchRestaurants = async (req, res) => {
	console.log("Searching Rest on the backend");

	//categories filter in params object
	//radius in meters
	const { currentSession } = req.body;

	//const sessionCategories = convertToYelpCategories(currentSession.categories);
	console.log(currentSession.categories);

	const restauraunts = await yelp.get("/businesses/search", {
		params: {
			categories: currentSession.categories.toString(),
			latitude: currentSession.latitude,
			longitude: currentSession.longitude,
			radius: 8047,
		},
	});
	res.json(restauraunts.data);
};

convertToYelpCategories = (categories) => {
	return [];
};

module.exports = {
	getRestaurantCategories,
	getRestaurantInfo,
	searchRestaurants,
};
