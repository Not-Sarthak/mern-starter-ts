import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/api/products", (req: Request, res: Response): any => {
  console.log(req.headers.cookie);
  console.log(req.cookies);

  return res.status(200).send({
    msg: "Products API",
  });
});

export default router;
