import { requireAuth, validateRequest } from "@ir-tixtrade/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/tickets";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must be valid"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
