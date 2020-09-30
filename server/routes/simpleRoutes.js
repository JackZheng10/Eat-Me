const {
    helloWorld,
    helloDB,
    getDB,
    deleteDB,
    sendNotification,
  } = require("../controllers/simpleController"),
  express = require("express"),
  router = express.Router();

router.post("/helloWorld", helloWorld);

router.get("/helloDB", helloDB);

router.get("/getDB", getDB);

router.get("/deleteDB", deleteDB);

router.get("/sendNotification", sendNotification);

module.exports = router;
