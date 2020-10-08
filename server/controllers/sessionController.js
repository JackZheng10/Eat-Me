const {
  checkForMatch,
  notifyOtherSessionUsers,
} = require("../helpers/sessionHelper");
const Session = require("../models/Session");
const { reverseGeocodeLocationIQ } = require("./apis/LocationIQ");

updateSessionMemberRestaurantIndex = async (req, res) => {
  const { userID, sessionID, currentRestaurantIndex } = req.body;
  try {
    const session = await Session.findOne({ ID: sessionID });

    const memberSessionStatus =
      currentRestaurantIndex >= session.restaurants.length
        ? "Waiting on friends"
        : "Started";

    //Update Status everytime. Maybe an issue, maybe not
    await Session.findOneAndUpdate(
      { ID: sessionID, "members.userID": userID },
      {
        $set: {
          "members.$.status": memberSessionStatus,
          "members.$.currentRestaurantIndex": currentRestaurantIndex,
        },
      }
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
      notifyOtherSessionUsers(sessionID, otherSessionUsers);

      //Maybe don't need status for overall session
      await Session.findOneAndUpdate(
        { ID: sessionID },
        { status: "Matched", matchedRestaurantIndex }
      );
    }

    res.json({ success: true, matchedRestaurantIndex });
  } catch (error) {
    res.json({ success: false, error });
  }
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

reverseGeocodeLatLong = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const addressResponse = await reverseGeocodeLocationIQ.get("", {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json",
      },
    });

    const { house_number, road, city, state } = addressResponse.data.address;

    const streetAddress = `${house_number} ${road} ${city}, ${state}`;

    res.json(streetAddress);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSessionRestaurants,
  addVoteToSession,
  updateSessionMemberRestaurantIndex,
  reverseGeocodeLatLong,
};
