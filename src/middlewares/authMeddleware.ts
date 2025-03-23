import { Request, Response, NextFunction } from "express";
import jwtService from "../services/jwt";
import RequestError from "../utils/errors";
import prisma from "../services/prisma";


const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      RequestError(res, 401, "No token provided");
      return;
    }
    
    const [bearer, token] = authHeader.split(" ");
    
    if (bearer !== "Bearer" || !token) {
      RequestError(res, 401, "Invalid token format");
      return;
    }
    
    // Verify JWT signature and expiration
    const payload = jwtService.verifyToken(token);
    if (!payload) {
      RequestError(res, 401, "Invalid token");
      return;
    }
    
    // Check if token exists in database
    const tokenRecord = await prisma.token.findFirst({
      where: {
        userId: payload.id,
        accessToken: token,
        kind: 'access',
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!tokenRecord) {
      RequestError(res, 401, "Token revoked or expired");
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { profile: true }
    });
    
    if (!user) {
      RequestError(res, 401, "User not found");
      return;
    }
    
    // Add user and token to request for use in controllers
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;