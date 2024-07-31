import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';

const createTicket = () =>{
    return request(app)
    .post('/api/tickets')
    .set("Cookie", signin())
    .send({
        title:"fdsf",
        price:20
    })
}

it("returns the ticket list", async ()=>{
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

    expect(response.body.length).toEqual(3);
})