import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
// Define the controller function type
type Controller = (req: Request, res: Response, next: NextFunction) => void;

// const ctrlWrapper = (ctrl: Controller):RequestHandler => {
//   const func = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       ctrl(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
//   return func;
// };

function ctrlWrapper<
  P extends Record<string, any> = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  controller: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Type assertion here is safe because we're just passing through the request
      await controller(req as any, res as any, next);
    } catch (error) {
      next(error);
    }
  };
}

export default ctrlWrapper;