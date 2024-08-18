import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../model/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();
import { validateRequest, BadRequestError} from "@ir-tixtrade/common"

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
    console.log("Successfully done the signup with", email);
    res.status(201).send(user);
  }
);

export { router as signupRouter };
