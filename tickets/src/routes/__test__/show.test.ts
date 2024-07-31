import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import mongoose from 'mongoose';

it("returns a 404 if the ticket is not found with the id", async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found with the id", async ()=>{
    const title = "concert";
    const price = 10;
    const response = await request(app)
    .post('/api/tickets')
    .set("Cookie", signin())
    .send({
        title,
        price
    })
    .expect(201);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})