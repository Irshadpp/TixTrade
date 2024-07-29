import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";

it("response with details about current user", async()=>{
  const cookie = await signin();
  const response = await request(app)
  .get('/api/users/current-user')
  .set("Cookie", cookie)
  .send()
  .expect(200);

  expect(response.body.currentUser.email).toEqual("test@gmail.com");
})


it("should return currentUser as null", async()=>{
  const response = await request(app)
  .get('/api/users/current-user')
  .send()
  .expect(200)
  expect(response.body.currentUser).toEqual(null);
})