import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../model/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 10 })
      .withMessage("Password must be between 4 and 10 charecters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      // console.log("User already exist in ",email);
      // return res.send({});
      throw new BadRequestError("Email already in use");
    }
    const hashedPassword = await Password.toHash(password);
    const user = User.build({ email, password: hashedPassword });
    await user.save();
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
