const mongoose = require("mongoose");
const { yelp } = require("./apis/yelp");

const getRestaurantCategories = async (req, res) => {
	
	try{
		const categories = await yelp.get('/categories');
		res.json(categories.data);
	}
	catch(error){
		//How i think error handling shoould be instead of chain statements
		console.log(error);
	}

};

const getRestaurantInfo = async (req, res) =>{
	const businessURL = `/businesses/${req.body.restaurantID}`;
	const restaurauntInfo = await yelp.get(businessURL);
	res.json(restaurauntInfo.data);
};

const searchRestaurants = async (req, res) =>{
	console.log("Searching Rest on the backend");
	//think we should use latitude and longitude like coordinates from a map to get location
	//stored in session DB object
	//categories filter in params object
	//radius in meters
	const restauraunts = await yelp.get('/businesses/search', {
		params: {
			latitude: 26.065090,
			longitude: -80.232210,
			radius: 8047
		}
	});
	res.json(restauraunts.data);
};

module.exports = { getRestaurantCategories, getRestaurantInfo, searchRestaurants };