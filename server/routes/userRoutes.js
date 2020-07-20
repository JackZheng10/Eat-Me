const {
    login,
    checkDuplicatePhone,
    countUsers,
    register,
    findUser,
    addFriend,
    updateToken,
    checkExistingRequests,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/login", login);
router.get("/checkDuplicatePhone", checkDuplicatePhone);
router.post("/register", countUsers, register);
router.post("/addFriend", findUser, checkExistingRequests, addFriend);
router.get("/updateToken", updateToken);

module.exports = router;
