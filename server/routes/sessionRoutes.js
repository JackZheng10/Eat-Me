const { getSessionRestaurants } = require("../controllers/sessionController"),
  express = require("express"),
  router = express.Router();

router.post("/getSessionRestaurants", getSessionRestaurants);

module.exports = router;
