import passport from "passport";
import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post(
	"/api/auth",
	passport.authenticate("local"),
	(request, response) => {
		response.sendStatus(200);
	}
);

router.get("/api/auth/status", (request: Request, response: Response): any => {
	return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request: Request, response: Response): any => {
	if (!request.user) return response.sendStatus(401);
	request.logout((err) => {
		if (err) return response.sendStatus(400);
		response.send(200);
	});
});

router.get("/api/auth/discord", passport.authenticate("discord"));

router.get(
	"/api/auth/discord/redirect",
	passport.authenticate("discord"),
	(request, response) => {
		response.sendStatus(200);
	}
);

export default router;