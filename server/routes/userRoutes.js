const {
    login,
    checkDuplicatePhone,
    countUsers,
    register,
    findUser,
    addFriend,
    updateToken,
    checkExistingRequests,
    acceptFriend,
    declineFriend,
    getUsersByID,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/login", login);
router.get("/checkDuplicatePhone", checkDuplicatePhone);
router.post("/register", countUsers, register);
router.put("/addFriend", findUser, checkExistingRequests, addFriend);
router.get("/updateToken", updateToken);
router.put("/acceptFriend", findUser, acceptFriend);
router.put("/declineFriend", findUser, declineFriend);
router.post("/getUsersByID", getUsersByID);

module.exports = router;
