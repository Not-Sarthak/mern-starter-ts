import { NextFunction, Request, Response } from "express";
import { mockUsers } from "./constants.js";

interface RequestWithUser extends Request {
    findUserIndex: number;
}

export const resolveIndexByUserId: any = (request: RequestWithUser, response: Response, next: NextFunction) => {
	const {
		params: { id },
	} = request;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return response.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return response.sendStatus(404);
	request.findUserIndex = findUserIndex;
	next();
};