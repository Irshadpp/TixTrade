import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signin } from "../../test/setup";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if the provided id is does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "dfkjsl",
      price: 20,
    })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "dfkjsl",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "dfjslk",
      price: 20,
    });

  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "dfskjdsfds",
      price: 299,
    })
    .expect(401);
});

it("returns 400 if the the user provide invalid title and price", async () => {
  const cookie = await signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dfjslk",
      price: 20,
    });

  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 299,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "fdsfsf",
      price: -299,
    })
    .expect(400);
});

it("updates the ticket with provided valid input", async () => {
  const cookie = await signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dfjslk",
      price: 20,
    });

  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "new Title",
      price: 20,
    })
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${id}`).send();

  expect(ticketResponse.body.title).toEqual("new Title");
  expect(ticketResponse.body.price).toEqual(20);
});

it("publish an event", async () => {
  const cookie = await signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "dfjslk",
      price: 20,
    });

  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "new Title",
      price: 20,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
