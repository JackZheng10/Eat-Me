const {
    login,
    checkDuplicatePhone,
    countUsers,
    register,
    findUser,
    addFriend,
    updateToken,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/login", login);
router.get("/checkDuplicatePhone", checkDuplicatePhone);
router.post("/register", countUsers, register);
router.post("/addFriend", findUser, addFriend);
router.get("/updateToken", updateToken);

module.exports = router;
