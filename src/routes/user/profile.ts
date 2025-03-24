import { Router } from "express";
import profile from "../../controllers/user/profile";
import ctrlWrapper from "../../helpers/ctrlWrapper";
import validateBody from "../../middlewares/validateBody";
import profileSchema from "../../schemas/user/profile";

const router = Router();

// Get user profile
router.get("/", ctrlWrapper(profile.getProfile));

// Update user profile
router.put(
  "/",
  validateBody(profileSchema.updateProfile),
  ctrlWrapper(profile.updateProfile)
);

// Update profile picture
router.patch(
  "/picture",
  validateBody(profileSchema.updatePicture),
  ctrlWrapper(profile.updateProfilePicture)
);

// Update cover photo
router.patch(
  "/cover",
  validateBody(profileSchema.updateCoverPhoto),
  ctrlWrapper(profile.updateCoverPhoto)
);

export default router;