import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../model/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken"
import {validateRequest, BadRequestError } from "@ir-tixtrade/common"

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Must give a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if(!existingUser){
        throw new BadRequestError("Invalid credentials");
    }
    const matchPasword = await Password.compare(existingUser.password, password);
    if(!matchPasword){
      throw new BadRequestError("Invalid credentials");
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
