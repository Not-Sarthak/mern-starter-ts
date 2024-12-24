import { matchedData, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.js";
import { hashPassword } from "../utils/helpers.js";
import { User } from "../schemas/user.js";
import { Request, Response } from "express";

interface RequestWithUser extends Request {
    findUserIndex: number;
}

export const getUserByIdHandler: any = (request: RequestWithUser, response: Response) => {
    const { findUserIndex } = request;
	const findUser = mockUsers[findUserIndex];
	if (!findUser) return response.sendStatus(404);
	return response.send(findUser);
};

export const createUserHandler: any = async (request: Request, response: Response) => {
	const result = validationResult(request);
	if (!result.isEmpty()) return response.status(400).send(result.array());
	const data = matchedData(request);
	data.password = hashPassword(data.password);
	const newUser = new User(data);
	try {
		const savedUser = await newUser.save();
		return response.status(201).send(savedUser);
	} catch (err) {
		return response.sendStatus(400);
	}
};