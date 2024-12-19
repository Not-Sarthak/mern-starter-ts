import { Router } from "express";
import userRouter from "./user.js";
import productRouter from "./product.js";

const router = Router();

router.use(userRouter);
router.use(productRouter);

export default router;