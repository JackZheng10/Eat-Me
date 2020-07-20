const jwt = require("jsonwebtoken"),
  User = require("../models/User.js"),
  jwt_secret = process.env.secret || require("../config/config.js").jwt.secret;

//todo: oauth/passport/auth0/firebase...

// function to create tokens, access time is 24 hrs by default
const signToken = (user) => {
  const userData = user.toObject();
  delete userData.password;
  return jwt.sign(userData, jwt_secret); //formats it into the JWT encoded xx.xx.xx, to be served to frontend if needed
};

// function to verify tokens
const verifyToken = async (req, res, next) => {
  const token = req.get("token") || req.body.token || req.query.token;

  // reject user if no token
  if (!token) {
    return res.json({ success: false, message: "No token provided." });
  }

  // try to verify token
  jwt.verify(token, jwt_secret, async (err, decodedData) => {
    // error check
    if (err) {
      return res.json({
        success: false,
        message: "Error with token. Please relog and try again.",
      });
    }

    // find user associated with token
    try {
      const user = await User.findById(decodedData._id);

      if (!user) {
        return res.json({
          success: false,
          message: "Error with token. Please relog and try again.",
        });
      } else {
        res.locals.tokenUser = user;
        next();
      }
    } catch (error) {
      console.log("Error with finding user associated with token: " + error);
      return res.json({
        success: false,
        message: "Error with token. Please relog and try again.",
      });
    }
  });
};

module.exports = {
  signToken,
  verifyToken,
};
