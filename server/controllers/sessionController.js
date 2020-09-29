const { yelp } = require("./apis/yelp");
const Session = require("../models/Session");

updateSessionMemberRestaurantIndex = async (req, res) => {
  const { userID, sessionID, currentRestaurantIndex } = req.body;
  try {
    await Session.findOneAndUpdate(
      { ID: sessionID, "members.userID": userID },
      { $set: { "members.$.currentRestaurantIndex": currentRestaurantIndex } }
    );

    res.json({ success: true });
  } catch (error) {
    console.log("Error updating members restaurant index: " + error);
    res.json({ success: false, error });
  }
};

addVoteToSession = async (req, res) => {
  const { restaurantIndex, sessionID, userID } = req.body;

  try {
    const session = await Session.findOneAndUpdate(
      { ID: sessionID, "members.userID": userID },
      {
        $push: {
          "members.$.selectedRestaurants": restaurantIndex,
        },
      }
    );

    for (let i = 0; i < session.members; i++) {
      if (session.members[i].userID == userID) {
        session.members[i].selectedRestaurants.push(restaurantIndex);
        break;
      }
    }

    const matchedRestaurantIndex = checkForMatch(session.members);

    if (matchedRestaurantIndex != -1) {
      //Filters out user who caused the match
      const otherSessionUsers = session.members.filter(
        (sessionMember) => sessionMember.userID != userID
      );
      notifyOtherSessionUsers(otherSessionUsers);

      await Session.findOneAndUpdate(
        { ID: sessionID },
        { status: "Match", matchedRestaurantIndex }
      );
    }

    res.json({ success: true, matchedRestaurantIndex });
  } catch (error) {
    res.json({ success: false, error });
  }
};

checkForMatch = (sessionMembers) => {
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

notifyOtherSessionUsers = (sessionMembers) => {
  //Send some type of notification about Match
  const sessionMemberIDs = sessionMembers.map((sessionMember) => {
    return sessionMember.ID;
  });
  const otherSessionUsers = User.find({ ID: sessionMemberIDs }).select(
    "phone pushToken"
  );

  try {
    const SIO = require("../server").SIO;

    otherSessionUsers.forEach((sessionUser) => {
      SIO.of("/api/socket").to(recipient.phone).emit("incomingFriendRequest");

      sendPushNotification(
        recipient.pushToken,
        `You've received a friend request from ${req.body.senderName}`
      );
    });
  } catch (error) {}
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
    phone: yelpRestaurant.display_phone,
  };

  return restaurantModel;
};

module.exports = {
  getSessionRestaurants,
  addRestaurantsToSession,
  addVoteToSession,
  updateSessionMemberRestaurantIndex,
};
