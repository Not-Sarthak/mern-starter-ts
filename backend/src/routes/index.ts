import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./user.js";
import productRouter from "./product.js";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(productRouter);

export default router;