import request from "supertest";
import { app } from "../../app";

it("return a 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);
});

it("return a 400 with a invalid email message", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "tesailcom",
        password: "123456",
      })
      .expect(400);
  });

  it("return a 400 with a password must be 5 to 10 charecter message", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "6",
      })
      .expect(400);
  });

  it("return a 400 with email and password missing message", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
      })
      .expect(400);

      await request(app)
      .post("/api/users/signup")
      .send({
        password: "63874232",
      })
      .expect(400);
  });

  it("dissallow duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "3432987"
      })
      .expect(201);

      await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "3432987"
      })
      .expect(400);
  });

  it("sets a cookie after successfull signup",async()=>{
    const response = await request(app)
    .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "3432987"
      })
      .expect(201);
      const cookie = response.get('Set-Cookie');
      expect(cookie).toBeDefined();
  })