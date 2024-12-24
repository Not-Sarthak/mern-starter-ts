import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../create-app.js";
import { Express } from 'express'; 

describe("/api/auth", () => {
    let app: Express;
    
    beforeAll(() => {
        try {
            mongoose.connect("mongodb://localhost/express_tutorial_test");
            console.log("Connected to Test Database");
            app = createApp();
            console.log("App Created");
        } catch (err) {
            console.error(`Error connecting to test database: ${err}`);
            throw err;
        }
    }, 10000);

    it("Should Return 401 when not Logged In", async () => {
        const response = await request(app).get("/api/auth/status");
        expect(response.statusCode).toBe(401);
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            console.log("Cleanup completed");
        } catch (err) {
            console.error(`Error during cleanup: ${err}`);
            throw err;
        }
    });
});