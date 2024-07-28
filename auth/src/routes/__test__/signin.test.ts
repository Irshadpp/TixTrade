import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "542343",
    })
    .expect(400);
});

it("responds with cookie when give valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(200);
  const cookie = response.get("Set-Cookie");
  expect(cookie).toBeDefined();
});
