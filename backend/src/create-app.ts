import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local-strategy.js";

export function createApp() {
	const app = express();
	app.use(express.json());
	app.use(cookieParser("hellosarthak"));
	app.use(
		session({
			secret: "sarthak",
			saveUninitialized: true,
			resave: false,
			cookie: {
				maxAge: 60000 * 60,
			},
			store: MongoStore.create({
				client: mongoose.connection.getClient(),
			}),
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(routes);

	return app;
}