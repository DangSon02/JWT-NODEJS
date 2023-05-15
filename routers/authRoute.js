const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("./../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/all-users", userController.getAllUsers);
router.get("/refresh", userController.handleRefreshToken);
router.get("/logout", userController.logout);
router.get(
  "/:id",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  userController.getaUser
);
router.delete("/:id", userController.deleteUser);
router.patch(
  "/edit-user",
  authMiddleware.authMiddleware,
  userController.updateaUser
);
router.patch(
  "/block-user/:id",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  userController.blockUser
);
router.patch(
  "/unblock-user/:id",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  userController.unblockUser
);

module.exports = router;
