import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";
import { RequestHandler } from "express";
import RequestError from "../utils/errors";

const validateParams = (schema: AnyZodObject): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        RequestError(res, 400, error.issues[0].message);
        return;
      }
      RequestError(res, 400, "Invalid parameters");
      return;
    }
  };
};

export default validateParams;