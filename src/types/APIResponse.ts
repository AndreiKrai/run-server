/**
 * API Response Types
 * These types define the structure of API responses for frontend consumption
 */

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

// =================== Request Types ===================

/**
 * Registration request body
 */
export interface RegisterRequestBody {
  email: string; 
  password: string; 
  name?: string;
}

/**
 * Login request body
 */
export interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Email verification params
 */
export interface VerificationParams {
  emailVerificationToken: string;
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

// =================== API Response Wrapper ===================

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  statusCode: number;
  details?: any;
}

/**
 * API response wrapper type - discriminated union
 */
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; statusCode: number; details?: any };

// Common response types
export type RegisterApiResponse = ApiResponse<RegisterResponseData>;
export type LoginApiResponse = ApiResponse<LoginResponseData>;
export type VerificationApiResponse = ApiResponse<VerificationResponseData>;
export type LogoutApiResponse = ApiResponse<LogoutResponseData>;
export type UserApiResponse = ApiResponse<SafeUser>;