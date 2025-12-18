import { Router } from "express";
import {
  getUserByUsernameController,
  updateUserProfileController,
  searchUsersController,
  followUserController,
  unfollowUserController,
} from "../controllers/users.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/search", authenticate, searchUsersController);
router.get("/:username", authenticate, getUserByUsernameController);

router.post("/:id/follow", authenticate, followUserController);
router.post("/:id/unfollow", authenticate, unfollowUserController);

router.patch(
  "/:username",
  authenticate,
  upload.single("avatar"),
  updateUserProfileController,
);

export default router;
