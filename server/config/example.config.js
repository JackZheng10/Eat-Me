//This file holds any configuration variables we may need
//'config.js' is usually ignored by git to protect sensitive information, such as your database's username and password

module.exports = {
  db: {
    uri: "", //place the URI of your mongo database here
  },
  yelp: {
    apiKey: "", //place your yelp api key here
    clientId: "", //place your yelp client ID here
  },
  jwt: {
    secret: "", //secret used to sign JWT tokens
  },
  twilio: {
    accountSID: "", //twilio account SID
    authToken: "", //twilio auth token
    from: "", //twilio "from" number
  },
  pusher: {
    appID: "", //pusher app id
    key: "", //pusher key
    secret: "", //pusher secret
    cluster: "", //pusher cluster
  },
};
