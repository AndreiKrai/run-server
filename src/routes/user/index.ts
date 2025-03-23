import express from "express";
const router = express();
import addresRouter from "./address";

router.use("/address", addresRouter)

export default router;
