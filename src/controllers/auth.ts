import prisma from "../services/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import emailService from "../services/sendEmail/emailServise";
import { PrismaClient } from "@prisma/client";
import jwtService from "../services/jwt";

// Define User type based on Prisma Client
type User = Awaited<ReturnType<PrismaClient["user"]["findUnique"]>> & {};

import {
  RegisterRequestBody,
  LoginRequestBody,
  VerificationParams,
  RegisterResponseData,
  LoginResponseData,
  VerificationResponseData,
  LogoutResponseData,
} from "../types/APIResponse";
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
  RegisterRequestBody,
  RegisterResponseData
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
  return ApiResponder.success<RegisterResponseData>(
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
  VerificationParams,
  VerificationResponseData
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
  return ApiResponder.success<VerificationResponseData>(
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
const login: TypedBodyHandler<LoginRequestBody, LoginResponseData> = async (
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
  return ApiResponder.success<LoginResponseData>(
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
const logout: TypedBodyHandler<{}, LogoutResponseData> = async (
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
  return ApiResponder.success<LogoutResponseData>(
    res,
    { message: "Logout successful" },
    200
  );
};

const auth = { register, verification, login, logout };
export default auth;
