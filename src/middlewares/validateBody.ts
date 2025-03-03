import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import RequestError from "../utils/errors";

const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
         RequestError(res, 400, error.message);return
      }
       RequestError(res, 400, 'Invalid request body');return
    }
  };
};

export default validateBody;
