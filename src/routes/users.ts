import { Router, Request, Response } from 'express';
const router = Router();
import { register } from '../controllers/users';
import   ctrlWrapper  from '../helpers/ctrlWrapper';

router.post("/register", ctrlWrapper(register));
// router.post("/login", validateBody(loginSchema), ctrlWrapper(login));
// router.post("/logout", validateBody(logoutSchema), ctrlWrapper(logout));

export default router;
