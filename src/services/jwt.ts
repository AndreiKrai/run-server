import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import prisma from "./prisma";
const { JWT_SECRET } = process.env;

interface JwtPayload {
  id: number;
  email: string;
}

const createToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET || "default_secret_for_development", {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(
      token,
      JWT_SECRET || "default_secret_for_development"
    ) as JwtPayload;
  } catch (error) {
    return null;
  }
};
// Create or update token record - using upsert to handle existing tokens
const saveToken = async (token: string, userId: number) => {
  await prisma.token.upsert({
    where: {
      userId_kind: {
        userId: userId,
        kind: "access",
      },
    },
    update: {
      accessToken: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      tokenType: "Bearer",
    },
    create: {
      userId: userId,
      kind: "access",
      accessToken: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      tokenType: "Bearer",
    },
  });
};

const deleteAllAccessTokens = async (userId: number) => {
  await prisma.token.deleteMany({
    where: { userId: userId, kind: "access" },
  });
};
const jwtService = {
  createToken,
  verifyToken,
  saveToken,deleteAllAccessTokens
};

export default jwtService;
