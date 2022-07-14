import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeAll( async () => {
    connection = await createConnection("database");
    await connection.runMigrations();
  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("shold be able to create a new User", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "user",
      email: "user@example.com",
      password: "1234",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a user with an existent email", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "user",
      email: "user@example.com",
      password: "1234",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("User already exists")
  });
});
