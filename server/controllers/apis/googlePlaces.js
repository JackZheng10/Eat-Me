const axios = require("axios");

const googlePlaces = axios.create({
	baseURL: "https://maps.googleapis.com/maps/api/place/findplacefromtext",
});

module.exports = { googlePlaces };
