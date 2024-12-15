import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Route Middlewares
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  console.log("Hi");
  res.status(200).send({ msg: "Hello, world!" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
