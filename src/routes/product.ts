import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/api/products", (req: Request, res: Response): any => {
  console.log(req.headers.cookie);
  console.log(req.cookies);

  if (req.cookies.hello && req.cookies.hello === "World") {
    res.send([
      {
        id: 123,
        name: "Soda",
        price: 10,
      },
    ]);
  }

  return res.status(403).send({
    msg: "Incorrect Cookies",
  });
});

export default router;
