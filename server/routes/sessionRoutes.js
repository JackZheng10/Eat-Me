const {
    getSessionRestaurants,
    addVoteToSession,
  } = require("../controllers/sessionController"),
  express = require("express"),
  router = express.Router();

router.post("/getSessionRestaurants", getSessionRestaurants);
router.post("/addVoteToSession", addVoteToSession);

module.exports = router;
