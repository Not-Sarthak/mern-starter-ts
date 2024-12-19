import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.js";
import passport from "passport";
import "./strategies/local-strategy.js";

dotenv.config();

declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    user?: any;
  }
}

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "lord sarthak",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // 1 Hr
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Route Middleware
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  console.log("Hi");
  console.log(req.session);
  console.log(req.sessionID);

  req.session.visited = true;

  res.cookie("Hello", "World", { maxAge: 60000, signed: true });
  res.status(200).send({ msg: "Hello, world!" });
});

app.post("/api/auth", passport.authenticate(["local", "github"]), (req: Request, res: Response) => {
  console.log("Here");
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
