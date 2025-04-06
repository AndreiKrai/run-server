import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z, ZodEffects } from "zod";
import { RequestHandler } from "express";
import RequestError from "../utils/errors";

type ZodSchema = AnyZodObject | ZodEffects<any, any>;

/**
 * Middleware to validate request query parameters against a Zod schema
 * @param schema Zod schema to validate against
 * @returns Express middleware function
 */
export const validateQuery = (schema: ZodSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse and validate query parameters
      const validatedData = await schema.parseAsync(req.query);
      
      // Replace the request's query with the validated data
      // This allows for type coercion (e.g., string → number)
      req.query = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract the first validation error message
        RequestError(res, 400, error.issues[0].message);
        return;
      }
      RequestError(res, 400, "Invalid query parameters");
      return;
    }
  };
};

