import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../model/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
const router = express();

router.post('/api/users/signup',
    [
        body('email')
        .isEmail()
        .withMessage("Email must be valid"),
        body('password')
        .trim()
        .isLength({min:4, max:10})
        .withMessage("Password must be between 4 and 10 charecters")
    ],
    async (req:Request, res:Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return res.status(400).send(errors.array());
            throw new RequestValidationError(errors.array())
        }
        const {email, password} = req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            // console.log("User already exist in ",email);
            // return res.send({});
            throw new BadRequestError("Email already in use")
        }
        const hashedPassword = await Password.toHash(password)
        const user = User.build({email, password: hashedPassword});
        await user.save();
        res.status(201).send(user);
});

export {router as signupRouter};