import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate user", () => {
  beforeAll(async ()=> {
    connection = await createConnection("database");
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "user",
      email: "user@example.com",
      password: "1234",
    }

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: user.email,
      password: user.password
    })

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate an user if email is wrong", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "wrong_email@exemple.com",
      password: "1234"
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Incorrect email or password");
  });

  it("should not be able to authenticate an user if password is wrong", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "user@example.com",
      password: "wrong_password"
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Incorrect email or password");
  });
});
