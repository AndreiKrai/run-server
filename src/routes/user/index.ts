import express from "express";
const router = express();
import addresRouter from "./address";
import profileRouter from "./profile";
import authMiddleware from "../../middlewares/authMeddleware"; 

// Protected routes - auth user has access
router.use(authMiddleware);

router.use("/address", addresRouter)
router.use("/profile", profileRouter)


export default router;
