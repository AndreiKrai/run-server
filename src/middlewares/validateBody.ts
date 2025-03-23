import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z ,ZodEffects} from "zod";
import { RequestHandler } from "express";
import RequestError from "../utils/errors";

type ZodSchema = AnyZodObject | ZodEffects<any, any>;

const validateBody = (schema: ZodSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        RequestError(res, 400, error.issues[0].message);
        return;
      }
      RequestError(res, 400, "Invalid request body");
      return;
    }
  };
};

export default validateBody;