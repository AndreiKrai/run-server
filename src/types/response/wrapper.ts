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