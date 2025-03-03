import { Router } from "express";
import { register } from "../controllers/users";
import ctrlWrapper from "../helpers/ctrlWrapper";
import validateBody from "../middlewares/validateBody";
import { registerSchema } from "../schemas/userSchema";

const router = Router();
router.post("/register", validateBody(registerSchema), ctrlWrapper(register));

export default router;