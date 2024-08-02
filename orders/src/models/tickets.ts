import { OrderStatus } from "@ir-tixtrade/common";
import mongoose from "mongoose";
// import { Order } from "./orders";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function(){
  const Order = mongoose.model('Order');
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{
            $in:[
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
                OrderStatus.Created
            ]
        }
    });
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
