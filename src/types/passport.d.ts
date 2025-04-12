// declare module as there is some error with importing
declare module 'passport' {
    import { RequestHandler } from 'express';
    
    interface Authenticator {
      initialize(): RequestHandler;
      session(): RequestHandler;
      authenticate(strategy: string | string[], options?: any): RequestHandler;
      use(strategy: any): any;
      serializeUser(fn: (user: any, done: (err: any, id?: any) => void) => void): void;
      deserializeUser(fn: (id: any, done: (err: any, user?: any) => void) => void): void;
    }
    
    const passport: Authenticator;
    export = passport;
  }