import {
  RegisterResponseData,
  LoginResponseData,
  VerificationResponseData,
  LogoutResponseData,
  OAuthResponseData,
  SafeUser,
} from "./auth";

// ===================Controller Response Data Types ===================

export namespace Auth {
  export type Register = RegisterResponseData;
  export type Login = LoginResponseData;
  export type Verification = VerificationResponseData;
  export type Logout = LogoutResponseData;
  export type User = SafeUser;
  export type OAuth = OAuthResponseData;
}
