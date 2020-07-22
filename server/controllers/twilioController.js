const cryptoRandomString = require("crypto-random-string");

const accountSID =
  process.env.TWILIO_SID || require("../config/config").twilio.accountSID;
const authToken =
  process.env.TWILIO_AUTHTOKEN || require("../config/config").twilio.authToken;
const client = require("twilio")(accountSID, authToken);
const from = process.env.TWILIO_FROM || require("../config/config").twilio.from;

const verify = async (req, res) => {
  let code = cryptoRandomString({ length: 6, type: "numeric" });
  let to = req.body.to;

  try {
    await client.messages.create({
      body: `Your Eat Me verification code is: ${code}`,
      from: from,
      to: to,
    });

    return res.json({
      success: true,
      message: code,
    });
  } catch (error) {
    console.log("Error with sending verification code: ", error);

    return res.json({
      success: false,
      message: "Error with sending verification code. Please try again.",
    });
  }
};

module.exports = { verify };
