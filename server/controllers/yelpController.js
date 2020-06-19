const mongoose = require("mongoose");
const { yelp } = require("./apis/yelp");

const getRestarauntCategories = async (req, res) => {
	
	try{
		const categories = await yelp.get('/categories');
		res.json(categories.data);
	}
	catch(error){
		//How i think error handling shoould be instead of chain statements
		console.log(error);
	}

};

const getRestarauntInfo = async (req, res) =>{
	//ID may come from request
	const businessID = 'L6E2itP6FAooZR6K4NQXgg'
	const businessURL = `/businesses/${businessID}`;
	const restaurauntInfo = await yelp.get(businessURL);
	res.json(restaurauntInfo.data);
};

const searchRestaraunts = async (req, res) =>{
	
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

module.exports = { getRestarauntCategories, getRestarauntInfo, searchRestaraunts };