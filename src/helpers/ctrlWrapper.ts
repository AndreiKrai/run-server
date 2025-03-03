import { Request, Response, NextFunction } from 'express';

// Define the controller function type
type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const ctrlWrapper = (ctrl: Controller) => {
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