import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../create-app.js";
import { Express } from 'express'; 

describe("create user and login", () => {
	let app: Express;
	beforeAll(() => {
		mongoose
			.connect("mongodb://localhost/express_tutorial_test")
			.then(() => console.log("Connected to Test Database"))
			.catch((err) => console.log(`Error: ${err}`));

		app = createApp();
	});

	it("Should Create the User", async () => {
		const response = await request(app).post("/api/users").send({
			username: "adam123",
			password: "password",
			displayName: "Sarthak The Developer",
		});
		expect(response.statusCode).toBe(201);
	});

	it("Should Log the User in and visit /api/auth/status and return Auth User", async () => {
		const response = await request(app)
			.post("/api/auth")
			.send({ username: "adam123", password: "password" })
			.then((res) => {
				return request(app)
					.get("/api/auth/status")
					.set("Cookie", res.headers["set-cookie"]);
			});
		expect(response.statusCode).toBe(200);
		expect(response.body.username).toBe("adam123");
		expect(response.body.displayName).toBe("Sarthak The Developer");
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});