import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/api/products", (req: Request, res: Response) => {
  res.send([
    {
      id: 123,
      name: "Soda",
      price: 10,
    },
  ]);
});

export default router;
