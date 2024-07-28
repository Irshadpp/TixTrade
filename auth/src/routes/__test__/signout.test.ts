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
    .post("/api/users/signout")
    .send({})
    .expect(200);

  const cookie = response.get("Set-Cookie") as string[];
  const expectedCookie = "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly";

  // Normalize the cookie strings for case-insensitive comparison
  const normalizeCookie = (cookie: string) =>
    cookie.replace(/(Path|Expires|HttpOnly)/gi, (match) => match.toLowerCase());

  expect(normalizeCookie(cookie[0])).toEqual(normalizeCookie(expectedCookie));
});
