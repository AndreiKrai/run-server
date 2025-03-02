import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'express-ts-docker',
  });
});

export default router;