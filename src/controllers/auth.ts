import prisma from "../services/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import emailService from "../services/sendEmail/emailServise";
import { PrismaClient } from "@prisma/client";
import jwtService from "../services/jwt";
import * as Req from "../types/request";
import * as Res from "../types/response/cntrlResponse";

// Define User type based on Prisma Client
type User = Awaited<ReturnType<PrismaClient["user"]["findUnique"]>> & {};

import {
  TypedBodyHandler,
  TypedParamsHandler,
  ApiResponder,
} from "../types/ExpressHandler";

const { BASE_URL } = process.env;

/**
 * Register a new user
 */
const register: TypedBodyHandler<
  Req.Auth.Register["body"],
  Res.Auth.Register
> = async (req, res, next) => {
  const { email, name, password } = req.body;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return ApiResponder.error(res, 409, "Email already in use");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const emailVerificationToken = uuidv4();

  // Send verification email
  // await emailService.verification(email, emailVerificationToken, BASE_URL as string);

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      emailVerificationToken: "emailVerificationToken",
      profile: {
        create: {
          name: name || null,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    return ApiResponder.error(res, 400, "Failed to create user");
  }

  // Return sanitized user data
  return ApiResponder.success<Res.Auth.Register>(
    res,
    {
      user: {
        id: user.id,
        email: user.email,
        emailVerified: false,
        profile: {
          name: user.profile?.name || null,
        },
      },
    },
    201
  );
};

/**
 * Verify a user's email using verification token
 */
const verification: TypedParamsHandler<
  Req.Auth.Verification["params"],
  Res.Auth.Verification
> = async (req, res, next) => {
  const { emailVerificationToken } = req.params;

  // Find and verify user as before
  const user = await prisma.user.findUnique({
    where: { emailVerificationToken },
    include: { profile: true },
  });

  if (!user) {
    return ApiResponder.error(
      res,
      404,
      "Verification token not found or already used"
    );
  }

  // Update user to verified status
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
    },
    include: { profile: true },
  });
  return ApiResponder.success<Res.Auth.Verification>(
    res,
    {
      message: "Email verification successful. You can now login.",
      verified: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        profile: {
          name: updatedUser.profile?.name || null,
          picture: updatedUser.profile?.picture || null,
        },
      },
    },
    200
  );
};

/**
 * Log in a user
 */
const login: TypedBodyHandler<Req.Auth.Login["body"], Res.Auth.Login> = async (
  req,
  res,
  next
) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return ApiResponder.error(res, 401, "Email or password is incorrect");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return ApiResponder.error(res, 401, "Email or password is incorrect");
  }

  // Generate JWT token
  const token = jwtService.createToken(user);
  await jwtService.saveToken(token, user.id);

  // Return success response
  return ApiResponder.success<Res.Auth.Login>(
    res,
    {
      token,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        profile: {
          name: user.profile?.name || null,
          picture: user.profile?.picture || null,
        },
      },
    },
    200
  );
};

/**
 * Log out a user
 */
const logout: TypedBodyHandler<{}, Res.Auth.Logout> = async (
  req,
  res,
  next
) => {
  // Check if user exists
  if (!req.user) {
    return ApiResponder.error(res, 401, "Not authenticated");
  }

  const user = req.user as User;
  const userId = user.id;

  // Delete user's access tokens
  await jwtService.deleteAllAccessTokens(userId);

  // Return success response
  return ApiResponder.success<Res.Auth.Logout>(
    res,
    { message: "Logout successful" },
    200
  );
};

/**
 * Handle Google OAuth callback
 */
const googleCallback: TypedBodyHandler<{}, Res.Auth.OAuth> = async (
  req,
  res,
  next
) => {
  // The user is already set by passport middleware
  const user: User = req.user;

  if (!user) {
    return ApiResponder.error(res, 401, "Authentication failed");
  }

  // Generate JWT token
  const token = jwtService.createToken(user);
  await jwtService.saveToken(token, user.id);

  // Get the frontend URL from environment or use default
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

  // Option 2: Redirect with token (typical for web apps)
  return res.redirect(
    `${frontendUrl}/auth/callback?token=${token}&provider=google`
  );
};
const auth = { register, verification, login, logout, googleCallback };
export default auth;
