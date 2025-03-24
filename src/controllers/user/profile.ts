import prisma from "../../services/prisma";
import * as Req from "../../types/request";
import * as Res from "../../types/response/contrResp";
import {
  TypedBodyHandler,
  TypedParamsHandler,
  ApiResponder
} from "../../types/ExpressHandler";
import { User } from "../../types/db";

/**
 * Get user profile
 */
const getProfile: TypedParamsHandler<
  Req.User.Profile.Get,
  Res.User.Profile.Get
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;

  // Get user profile
  let profile = await prisma.profile.findUnique({
    where: { userId }
  });

  // If profile doesn't exist yet, create a default one
  if (!profile) {
    profile = await prisma.profile.create({
      data: { userId }
    });
  }

  return ApiResponder.success<Res.User.Profile.Get>(res, {
    profile
  });
};

/**
 * Update user profile
 */
const updateProfile: TypedBodyHandler<
  Req.User.Profile.Update["body"],
  Res.User.Profile.Update
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;
  const profileData = req.body;

  // Handle birthdate if it's a string
  if (profileData.birthdate && typeof profileData.birthdate === 'string') {
    profileData.birthdate = new Date(profileData.birthdate);
  }

  // Find existing profile
  const existingProfile = await prisma.profile.findUnique({
    where: { userId }
  });

  // If profile exists, update it; otherwise, create it
  const profile = existingProfile
    ? await prisma.profile.update({
        where: { userId },
        data: profileData
      })
    : await prisma.profile.create({
        data: {
          ...profileData,
          userId
        }
      });

  return ApiResponder.success<Res.User.Profile.Update>(res, {
    profile,
    message: "Profile updated successfully"
  });
};

/**
 * Update profile picture
 */
const updateProfilePicture: TypedBodyHandler<
  Req.User.Profile.UpdatePicture["body"],
  Res.User.Profile.UpdatePicture
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;
  const { picture } = req.body;

  // Find existing profile
  const existingProfile = await prisma.profile.findUnique({
    where: { userId }
  });

  // If profile exists, update it; otherwise, create it
  const profile = existingProfile
    ? await prisma.profile.update({
        where: { userId },
        data: { picture }
      })
    : await prisma.profile.create({
        data: {
          userId,
          picture
        }
      });

  return ApiResponder.success<Res.User.Profile.UpdatePicture>(res, {
    picture: profile.picture!,
    message: "Profile picture updated successfully"
  });
};

/**
 * Update cover photo
 */
const updateCoverPhoto: TypedBodyHandler<
  Req.User.Profile.UpdateCoverPhoto["body"],
  Res.User.Profile.UpdateCoverPhoto
> = async (req, res, next) => {
  const user = req.user as User;
  const userId = user.id;
  const { coverPhoto } = req.body;

  // Find existing profile
  const existingProfile = await prisma.profile.findUnique({
    where: { userId }
  });

  // If profile exists, update it; otherwise, create it
  const profile = existingProfile
    ? await prisma.profile.update({
        where: { userId },
        data: { coverPhoto }
      })
    : await prisma.profile.create({
        data: {
          userId,
          coverPhoto
        }
      });

  return ApiResponder.success<Res.User.Profile.UpdateCoverPhoto>(res, {
    coverPhoto: profile.coverPhoto!,
    message: "Cover photo updated successfully"
  });
};

const profile = {
  getProfile,
  updateProfile,
  updateProfilePicture,
  updateCoverPhoto
};

export default profile;