import { Request, Response, NextFunction } from "express";
import { ApiResponder } from "../types/ExpressHandler";
import { User, UserRole} from "../types/db";
/**
 * Role enumeration for type safety
 */


/**
 * Check if user has one of the specified roles
 * @param roles Array of allowed roles
 */
export const hasRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists in request (should be set by authMiddleware)
    if (!req.user) {
      return ApiResponder.error(res, 401, "Authentication required");
    }

    const user = req.user as User;
    
    // If role field doesn't exist on user, add it to your User model in Prisma schema
    if (!user.role) {
      return ApiResponder.error(res, 500, "Role information is missing");
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(user.role as UserRole)) {
      return ApiResponder.error(
        res, 
        403, 
        "You don't have permission to access this resource"
      );
    }

    // User has required permission
    next();
  };
};

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);

/**
 * Middleware to check if user is a super admin
 */
export const isSuperAdmin = hasRole([UserRole.SUPER_ADMIN]);

/**
 * Middleware to check if user is a regular user (or higher)
 * This would allow any authenticated user
 */
export const isUser = hasRole([UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);