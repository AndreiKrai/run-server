import { ApiResponse } from "./wrapper";

// =================== User Types ===================
/**
 * User Profile information
 */
export interface UserProfile {
  name: string | null;
  gender?: string | null;
  location?: string | null;
  website?: string | null;
  picture?: string | null;
}

/**
 * Safe User data (no sensitive information)
 */
export interface SafeUser {
  id: number;
  email: string;
  emailVerified: boolean;
  profile: UserProfile | null;
}

// =================== Response Data Types ===================

/**
 * Registration response data
 */
export interface RegisterResponseData {
  user: SafeUser;
}

/**
 * Verification response data
 */
export interface VerificationResponseData {
  message: string;
  verified: boolean;
  user: SafeUser;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  token: string;
  user: SafeUser;
}

/**
 * Logout response data
 */
export interface LogoutResponseData {
  message: string;
}

export interface OAuthResponseData {
  token: string;
  user: SafeUser;
  provider: string;
}

// ===================API Response Data Types (client get that)===================

export namespace APIAuth  {
  export type Register = ApiResponse<RegisterResponseData>;
  export type Login = ApiResponse<LoginResponseData>;
  export type Verification = ApiResponse<VerificationResponseData>;
  export type Logout = ApiResponse<LogoutResponseData>;
  export type User = ApiResponse<SafeUser>;
  export type OAuth = ApiResponse<OAuthResponseData>;
}

// ===================Controller Response Data Types ===================

export namespace CntrAuth  {
  export type Register = RegisterResponseData;
  export type Login = LoginResponseData;
  export type Verification = VerificationResponseData;
  export type Logout = LogoutResponseData;
  export type User = SafeUser;
  export type OAuth = OAuthResponseData;
}
