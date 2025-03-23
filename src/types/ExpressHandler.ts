import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "./response/wrapper";

/**
 * Base Express handler type without response type checking
 */
export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Type-safe Express handler with typed request body
 * @template TReq Type of request body
 * @template TRes Type of response data
 */
export type TypedBodyHandler<TReq, TRes> = (
  req: Request<any, any, TReq>,
  res: Response<ApiResponse<TRes>>,
  next: NextFunction
) => Promise<void>;

/**
 * Type-safe Express handler with typed request params
 * @template TParams Type of URL parameters
 * @template TRes Type of response data
 */
export type TypedParamsHandler<TParams, TRes> = (
  req: Request<TParams>,
  res: Response<ApiResponse<TRes>>,
  next: NextFunction
) => Promise<void>;

/**
 * Type-safe Express handler with typed request body and params
 * @template TParams Type of URL parameters
 * @template TReq Type of request body
 * @template TRes Type of response data
 */
export type TypedFullHandler<TParams, TReq, TRes> = (
  req: Request<TParams, any, TReq>,
  res: Response<ApiResponse<TRes>>,
  next: NextFunction
) => Promise<void>;

/**
 * Helper functions for sending consistent API responses
 */
export const ApiResponder = {
  /**
   * Send a successful response with proper typing
   */
  success: <T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    message?: string
  ): void => {
    res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  },

  /**
   * Send an error response with proper typing
   */
  error: (
    res: Response,
    statusCode: number = 400,
    error: string = "Unknown error",
    details?: any
  ): void => {
    res.status(statusCode).json({
      success: false,
      error,
      statusCode,
      details,
    });
  },
};
