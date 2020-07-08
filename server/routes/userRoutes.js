const {
    login,
    checkDuplicatePhone,
    countUsers,
    register,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/login", login);
router.post("/register", checkDuplicatePhone, countUsers, register);

module.exports = router;
