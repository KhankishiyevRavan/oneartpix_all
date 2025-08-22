const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  getAllUsers,
  getUsersByRole,
  deleteUser,
  editUser,
  getUserNameById,
  getTechnicianUsers,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");

module.exports = router;

// Yeni istifadəçi yaratmaq üçün bir yol (route)
router.post(
  "/create-user",
  authMiddleware,
  //   requirePermission("users", "create"),
  createUser
);

router.get(
  "/:userId",
  authMiddleware,
  //   requirePermission("users", "read"),
  getUser
); // `:userId` parametrini götürürük

router.get(
  "/",
  authMiddleware,
  //   requirePermission("users", "read"),
  getAllUsers
); // Bütün istifadəçilər üçün endpoint

router.get(
  "/role/:roleName",
  authMiddleware,
  //   requirePermission("user.read"),
  getUsersByRole
);

router.delete(
  "/delete-user/:userId",
  authMiddleware,
  //   requirePermission("users", "delete"),
  deleteUser
);

router.post(
  "/edit-user/:userId",
  authMiddleware,
  //   requirePermission("users", "edit"),
  editUser
);
router.get("/fullname/:userId", authMiddleware, getUserNameById);
router.get(
  "/by-tech/technicians",
  authMiddleware,
  getTechnicianUsers
);

// router.put

module.exports = router;
