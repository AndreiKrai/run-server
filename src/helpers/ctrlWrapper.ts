import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
// Define the controller function type
type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const ctrlWrapper = (ctrl: Controller):RequestHandler => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;