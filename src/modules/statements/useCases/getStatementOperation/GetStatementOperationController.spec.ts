import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection: Connection;

describe("Get statement operation", () => {
  beforeAll(async ()=> {
    connection = await createConnection("database");
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get an statement operation", async () => {
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

    const statement = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const { id } = statement.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization : `Bearer ${token}`}
    );

    expect(response.status).toBe(200);
  });

  it("should not be able to get an statement operation if statement does not exists", async () => {
    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    const id = "052c1893-d699-4975-a888-d87aec20803c";

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization : `Bearer ${token}`}
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Statement not found");

  });
});