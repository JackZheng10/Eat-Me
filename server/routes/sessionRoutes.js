const { route } = require("./userRoutes");

const {
    getSessionRestaurants,
    addVoteToSession,
    updateSessionMemberRestaurantIndex,
  } = require("../controllers/sessionController"),
  express = require("express"),
  router = express.Router();

router.post("/getSessionRestaurants", getSessionRestaurants);
router.post("/addVoteToSession", addVoteToSession);
router.post(
  "/updateSessionMemberRestaurantIndex",
  updateSessionMemberRestaurantIndex
);

module.exports = router;
