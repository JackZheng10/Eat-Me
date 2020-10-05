/* Helper functions used in sessionController, etc. */

const { yelp } = require("../controllers/apis/yelp");
const User = require("../models/User");
const Session = require("../models/Session");
const sendPushNotification = require("./pushNotifications")
  .sendPushNotification;

const checkForMatch = (sessionMembers) => {
  let matches = new Set(sessionMembers[0].selectedRestaurants);

  for (let i = 1; i < sessionMembers.length; i++) {
    matches = new Set(
      [...matches].filter((restaurantIndex) =>
        new Set(sessionMembers[i].selectedRestaurants).has(restaurantIndex)
      )
    );
  }

  //return index of first restaruant from set if there is a match
  return matches.size > 0 ? matches.values().next().value : -1;
};

const notifyOtherSessionUsers = (sessionID, sessionMembers) => {
  const sessionMemberIDs = sessionMembers.map((sessionMember) => {
    return sessionMember.ID;
  });
  const otherSessionUsers = User.find({ ID: sessionMemberIDs }).select(
    "phone pushToken"
  );

  try {
    const SIO = require("../server").SIO;

    //Need Constants file to store certain textual information
    otherSessionUsers.forEach((sessionUser) => {
      SIO.of("/api/socket")
        .to(sessionUser.phone)
        .emit("sessionMatch", { sessionID, status: "Matched" });

      sendPushNotification(
        sessionUser.pushToken,
        `You have a match! Go see which spot you all selected.`
      );
    });
  } catch (error) {}
};

const addRestaurantsToSession = async (categories, location, sessionID) => {
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

//Get Yelp restaurant information
const getRestaurantDetails = async (restaurantID) => {
  const businessURL = `/businesses/${restaurantID}`;
  try {
    const yelpRestaurant = await yelp.get(businessURL);

    const restaurauntDetails = createRestaurantModel(yelpRestaurant.data);

    return restaurauntDetails;
  } catch (error) {}
};

//Creates RestaurantSchema from Restaurant data returned from Yelp
const createRestaurantModel = (yelpRestaurant) => {
  const restaurantModel = {
    ID: yelpRestaurant.id,
    images: yelpRestaurant.photos,
    hours: 0,
    name: yelpRestaurant.name,
    rating: yelpRestaurant.rating,
    transactions: yelpRestaurant.transactions,
    url: yelpRestaurant.url,
    phone: yelpRestaurant.display_phone,
  };

  return restaurantModel;
};

module.exports = {
  checkForMatch,
  notifyOtherSessionUsers,
  addRestaurantsToSession,
  getRestaurantDetails,
  createRestaurantModel,
};
