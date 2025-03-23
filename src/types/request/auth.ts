export interface Auth extends Express.Request {
  user?: any;
  token?: string;
}

// Routes organized by endpoint functionality
export namespace Auth {
  /**
   * Registration parameters
   */
  export interface Register {
    body: {
      email: string;
      password: string;
      name?: string;
    };
  }

  /**
   * Login parameters
   */
  export interface Login {
    body: {
      email: string;
      password: string;
    };
  }

  /**
   * Email verification parameters
   */
  export interface Verification {
    params: {
      emailVerificationToken: string;
    };
  }

  /**
   * Password reset parameters
   */
  export interface PasswordReset {
    body: {
      email: string;
    };
  }

  /**
   * Password update parameters
   */
  export interface PasswordUpdate {
    body: {
      password: string;
      confirmPassword: string;
    };
    params: {
      resetToken: string;
    };
  }

  /**
   * OAuth callback parameters
   */
  export interface OAuthCallback {
    // No parameters needed - handled by Passport
  }
}
