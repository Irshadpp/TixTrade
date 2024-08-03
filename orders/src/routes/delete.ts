import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@ir-tixtrade/common';
import express, {Request, Response} from 'express'
import { Order } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) =>{
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate('ticket');
        if(!order){
            throw new NotFoundError();
        };
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id:orderId,
            version: order.version,
            ticket:{
                id: order.ticket.id
            }
        })

    res.status(200).send(order);
});

export { router as deleteOrderRouter};