import { Router } from "express";
import auth from "../controllers/auth";
import ctrlWrapper from "../helpers/ctrlWrapper";
import validateBody from "../middlewares/validateBody";
import validateParams from "../middlewares/validateParams";
import authSchema from "../schemas/authSchema";
import loginLimiter from "../middlewares/reachLimiter";
import authMiddleware from "../middlewares/authMeddleware";
import passport from "passport";
const router = Router();

router.post(
  "/register",
  validateBody(authSchema.register),
  ctrlWrapper(auth.register)
);
router.get(
  "/verify/:emailVerificationToken",
  validateParams(authSchema.verification),
  ctrlWrapper(auth.verification)
);
router.post(
  "/login",
  loginLimiter,
  validateBody(authSchema.login),
  ctrlWrapper(auth.login)
);
// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: "/login" 
  }),
  ctrlWrapper(auth.googleCallback)
);
router.post("/logout", authMiddleware, ctrlWrapper(auth.logout));

export default router;
