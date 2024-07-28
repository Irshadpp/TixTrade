import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/current-user")
    .send()
    .expect(200);
    
});
