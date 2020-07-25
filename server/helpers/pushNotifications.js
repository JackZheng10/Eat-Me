const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

const sendPushNotification = async (token, message) => {
  //check if the token is valid
  //todo: maybe use an array of tokens if theyre using on multiple devices, would need to change schema for this
  if (!Expo.isExpoPushToken(token)) {
    console.log("Detected an invalid or N/A Expo push token, aborting.");
    return;
  }

  //set the message
  let messages = [
    {
      to: token,
      sound: "default",
      body: message,
      channelId: "notifications",
    },
  ];

  let chunks = expo.chunkPushNotifications(messages);

  //todo: handle where to go when user taps, also handle uninstall (token no longer used) or data clear, which generates new token
  //send the message
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("Push notification ticket: ", ticketChunk);
      // tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.log("Error with sending push notification: ", error);
      return;
    }
  }
};

module.exports = {
  sendPushNotification,
};
