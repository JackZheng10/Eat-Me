const { helloWorld } = require("../controllers/simpleController"),
  express = require("express"),
  router = express.Router();

router.post("/helloWorld", helloWorld);

module.exports = router;
