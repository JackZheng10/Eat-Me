const { route } = require("./userRoutes");

const {
    getSessionRestaurants,
    addVoteToSession,
    updateSessionMemberRestaurantIndex,
    reverseGeocodeLatLong,
  } = require("../controllers/sessionController"),
  express = require("express"),
  router = express.Router();

router.post("/getSessionRestaurants", getSessionRestaurants);
router.post("/addVoteToSession", addVoteToSession);
router.post(
  "/updateSessionMemberRestaurantIndex",
  updateSessionMemberRestaurantIndex
);

router.post("/reverseGeocodeLatLong", reverseGeocodeLatLong);

module.exports = router;
