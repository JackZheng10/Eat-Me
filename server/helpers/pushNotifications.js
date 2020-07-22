const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

const sendNotification = async (token, message) => {
  //push notification testing, hardcoded
  //!!! must check if the token exists first before sending it
  let messages = [
    {
      to: "", //hardcode token
      sound: "default",
      body: "This is a test notification",
      data: { withSome: "data" },
    },
  ];

  let chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      // tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = {
  sendNotification,
};
