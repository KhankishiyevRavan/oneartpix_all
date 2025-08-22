const express = require("express");
const {
  register,
  login,
  resetPassword,
  resetPasswordWithToken,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPasswordWithToken);
router.post("/refresh", refreshToken);

module.exports = router;
