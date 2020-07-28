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
    deleteFriend,
    getUsersByID,
    updatePushToken,
    createSession,
    updateName,
    updatePhone,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

//todo: think about what to do for AUTHORIZATION - aka does someone have permission to access this route. not if their token is valid or not (authentication)
//todo: ^^ prob use user from the authentication (found user who token is referring to)
//todo: see "sio youre doing it wrong"

router.post("/login", login);
router.get("/checkDuplicatePhone", checkDuplicatePhone);
router.post("/register", countUsers, register);
router.put("/addFriend", findUser, checkExistingRequests, addFriend);
router.get("/updateToken", updateToken);
router.put("/acceptFriend", findUser, acceptFriend);
router.put("/declineFriend", findUser, declineFriend);
router.put("/deleteFriend", findUser, deleteFriend);
router.post("/getUsersByID", getUsersByID);
router.put("/updatePushToken", findUser, updatePushToken);
router.post("/createSession", createSession);
router.put("/updateName", findUser, updateName);
router.put("/updatePhone", findUser, updatePhone);

module.exports = router;
