const { yelp } = require("./apis/yelp");
const Session = require("../models/Session");

addVoteToSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { ID: req.body.sessionID },
      { $push: { votes: req.body.restaurantIndex } }
    );

    session.votes.push(req.body.restaurantIndex);

    let matchedRestaurantIndex = findDuplicateRestaurantIndex(session.votes);

    if (matchedRestaurantIndex != -1) {
      notifyOtherSessionUsers(session.members, req.body.userID);
      await Session.findOneAndUpdate(
        { ID: req.body.sessionID },
        { status: "Match", matchedRestaurantIndex }
      );
    }

    res.json({ success: true, matchedRestaurantIndex });
  } catch (error) {
    res.json({ success: false, error });
  }
};

findDuplicateRestaurantIndex = (votes) => {
  let votesMap = {};

  for (let i = 0; i < votes.length; i++) {
    if (!votesMap[votes[i]]) votesMap[votes[i]] = 0;

    votesMap[votes[i]] += 1;

    if (votesMap[votes[i]] > 1) {
      return votes[i];
    }
  }

  return -1;
};

notifyOtherSessionUsers = (sessionMembers) => {
  //Send some type of notification about Match
};

getSessionRestaurants = async (req, res) => {
  const session = await Session.findOne({ ID: req.body.sessionID }).select(
    "restaurants members matchedRestaurantIndex"
  );

  //Filter out member with the userID of the current user
  const memberDetails = session.members.filter(
    (member) => member.userID == req.body.userID
  );

  const sessionDetails = {
    restaurants: session.restaurants,
    matchedRestaurantIndex: session.matchedRestaurantIndex,
    member: memberDetails[0],
  };

  res.json(sessionDetails);
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
  addVoteToSession,
};
