const { verify } = require("../controllers/twilioController"),
  express = require("express"),
  router = express.Router();

router.post("/verify", verify);

module.exports = router;
