const { yelp } = require("./apis/yelp");
const Session = require("../models/Session");

getSessionRestaurants = async (req, res) => {
  const session = await Session.findOne({ ID: req.body.ID }).select(
    "restaurants restaurantIndex"
  );

  res.json({ session });
};

addRestaurantsToSession = async (categories, location, sessionID) => {
  const restauraunts = await yelp.get("/businesses/search", {
    params: {
      categories: categories.toString(),
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 16094,
    },
  });

  //3 is temporary don't want to overload with API requests
  //So many API requests makes it slow to load all the restaurants(50 or so)
  //Probably get restaurants and update session after sending back response to server
  let sessionRestaurants = [];
  for (let i = 0; i < 3 && i < restauraunts.data.businesses.length; i++) {
    const restaurntDetails = await getRestaurantDetails(
      restauraunts.data.businesses[i].id
    );
    sessionRestaurants.push(restaurntDetails);
  }

  await Session.findOneAndUpdate(
    { ID: sessionID },
    { restaurants: sessionRestaurants }
  );
};

getRestaurantDetails = async (restaurantID) => {
  const businessURL = `/businesses/${restaurantID}`;
  try {
    const yelpRestaurant = await yelp.get(businessURL);

    const restaurauntDetails = createRestaurantModel(yelpRestaurant.data);

    return restaurauntDetails;
  } catch (error) {}
};

createRestaurantModel = (yelpRestaurant) => {
  const restaurantModel = {
    ID: yelpRestaurant.id,
    images: yelpRestaurant.photos,
    hours: 0,
    name: yelpRestaurant.name,
    rating: yelpRestaurant.rating,
    transactions: yelpRestaurant.transactions,
    url: yelpRestaurant.url,
  };

  return restaurantModel;
};

module.exports = {
  getSessionRestaurants,
  addRestaurantsToSession,
};
