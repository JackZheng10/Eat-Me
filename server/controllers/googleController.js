const { googlePlaces } = require("./apis/googlePlaces");
const { googlePlaces: googlePlacesKey } = require("../config/config");

const getPlaces = async (req, res) => {
	const { searchTerm } = req.body;

	try {
		const places = await googlePlaces.get("/json", {
			params: {
				key: googlePlacesKey.apiKey,
				input: searchTerm,
				inputtype: "textquery",
				fields: "formatted_address,name,geometry",
			},
		});
		res.json(places.data);
	} catch (error) {
		console.log(error);
	}
};

/* Format of API String
https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyDbvlaVuRUSTcZoMWDmLa_-KftUuxl9q2Q&input=3740&inputtype=textquery
*/

module.exports = { getPlaces };
