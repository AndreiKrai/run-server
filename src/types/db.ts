import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "superadmin"
}

/**
 * User model type with all fields
 */
export type User = {
  id: number;
  email: string;
  password: string;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  emailVerificationToken: string | null;
  emailVerified: boolean;
  googleId: string | null;
  facebookId: string | null;
  appleId: string | null;
  githubId: string | null;
  provider: string | null;
  lastLogin: Date | null;
  role: UserRole | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for flexibility)
  profile?: Profile | null;
  tokens?: Token[];
  addresses?: Address[];
};

/**
 * Profile model type
 */
export type Profile = {
  id: number;
  userId: number;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  gender: string | null;
  birthdate: Date | null;
  location: string | null;
  website: string | null;
  bio: string | null;
  picture: string | null;
  coverPhoto: string | null;
  phoneNumber: string | null;
  language: string | null;
  timezone: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  user?: User;
};

/**
 * Token model type
 */
export type Token = {
  id: number;
  userId: number;
  kind: string;
  accessToken: string;
  refreshToken: string | null;
  tokenType: string | null;
  expiresAt: Date | null;
  scope: string | null;
  raw: JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  user?: User;
};

/**
 * Address model type
 */
export type Address = {
  id: number;
  userId: number;
  type: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  isPrimary: boolean;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  user?: User;
};

/**
 * Safe user type with non-sensitive information for client responses
 */
export type SafeUser = Pick<User, 
  'id' | 
  'email' | 
  'emailVerified' | 
  'provider' | 
  'lastLogin' | 
  'createdAt'
> & {
  profile?: SafeProfile | null;
};

/**
 * Safe profile type for client responses
 */
export type SafeProfile = Omit<Profile, 'userId' | 'user'>;

/**
 * Request user with auth properties
 * For use with Express Request object
 */
export type RequestUser = User & {
  id: number; // Explicitly include id to avoid TypeScript issues
};

/**
 * Extend Express Request interface to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      token?: string;
    }
  }
}