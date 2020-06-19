const { getRestarauntCategories, searchRestaraunts, getRestarauntInfo } = require("../controllers/yelpController"),
  express = require("express"),
  router = express.Router();

router.get("/categories", getRestarauntCategories);

router.post("/session-restaraunts", searchRestaraunts);
//Futute Post methods I believe
router.get("/session-restaraunts", searchRestaraunts);
router.get("/restaraunt", getRestarauntInfo);

module.exports = router;