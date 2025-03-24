import express from "express";
const router = express();
import addresRouter from "./address";
import profileRouter from "./profile";

router.use("/address", addresRouter)
router.use("/profile", profileRouter)


export default router;
