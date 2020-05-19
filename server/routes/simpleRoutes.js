const { helloWorld, helloDB, getDB, deleteDB, getUserSessions } = require("../controllers/simpleController"),
  express = require("express"),
  router = express.Router();

router.post("/helloWorld", helloWorld);

router.post("/getUserSessions", getUserSessions);

router.get("/helloDB", helloDB);

router.get("/getDB", getDB);

router.get("/deleteDB", deleteDB);

module.exports = router;
