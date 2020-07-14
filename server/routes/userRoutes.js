const {
    login,
    checkDuplicatePhone,
    countUsers,
    register,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/login", login);
router.post("/checkDuplicatePhone", checkDuplicatePhone);
router.post("/register", countUsers, register);

module.exports = router;
