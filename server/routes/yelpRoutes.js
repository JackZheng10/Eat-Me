const { getRestaurantCategories, searchRestaurants, getRestaurantInfo } = require("../controllers/yelpController"),
  express = require("express"),
  router = express.Router();

router.get("/categories", getRestaurantCategories);

router.post("/session-restaurants", searchRestaurants);

router.post("/restaurant", getRestaurantInfo);


module.exports = router;