import { ApiResponse, } from "../wrapper";
import {
  RegisterResponseData,
  LoginResponseData,
  VerificationResponseData,
  LogoutResponseData,
  OAuthResponseData,SafeUser
} from "./auth";

// ===================API Response Data Types (client get that)===================

export namespace Auth {
  export type Register = ApiResponse<RegisterResponseData>;
  export type Login = ApiResponse<LoginResponseData>;
  export type Verification = ApiResponse<VerificationResponseData>;
  export type Logout = ApiResponse<LogoutResponseData>;
  export type User = ApiResponse<SafeUser>;
  export type OAuth = ApiResponse<OAuthResponseData>;
}
