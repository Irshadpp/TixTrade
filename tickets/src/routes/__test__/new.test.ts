import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../model/tickets";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const respose = await request(app).post("/api/tickets").send({});

  expect(respose.status).not.toEqual(404);
});

it("only accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
  const cookie = await signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 10
    })
    .expect(400);
});

it("return an error if invalid price is provided", async () => {
    await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "fdsafasf",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title: "djfsl"
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = "fdjslf";
    const price = 20

    await request(app)
    .post('/api/tickets')
    .set("Cookie", signin())
    .send({
        title,
        price
    })
    .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price)
});

it("has a route handler listening to /api/tickets for post requests", async () => {});
