import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection: Connection;

describe("Get balance", () => {
  beforeAll(async ()=> {
    connection = await createConnection("database");
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user balance", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "user",
      email: "user@example.com",
      password: "1234",
    });

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });
});
