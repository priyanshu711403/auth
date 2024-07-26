const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

beforeAll((done) => {
   db.query("DELETE FROM users", done);
});

describe("Auth Endpoints", () => {
   it("should register a new user", async () => {
      const response = await request(app).post("/api/register").send({
         username: "testuser",
         email: "testuser@example.com",
         password: "password123",
      });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
   });

   it("should login a user and return a token", async () => {
      await request(app).post("/api/register").send({
         username: "testuser",
         email: "testuser@example.com",
         password: "password123",
      });

      const response = await request(app).post("/api/login").send({
         email: "testuser@example.com",
         password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
   });

   it("should get profile of logged-in user", async () => {
      const loginResponse = await request(app).post("/api/login").send({
         email: "testuser@example.com",
         password: "password123",
      });

      const token = loginResponse.body.token;

      const response = await request(app).get("/api/profile").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("testuser");
      expect(response.body.email).toBe("testuser@example.com");
   });
});
