const { getPlaces } = require("../controllers/googleController"),
	express = require("express"),
	router = express.Router();

router.post("/find-places", getPlaces);

module.exports = router;
