const examples = require("../controllers/example.controller.js"),
  express = require("express"),
  router = express.Router();

router.route("/").get(examples.hello);

module.exports = router;
