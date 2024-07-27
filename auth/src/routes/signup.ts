import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

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
    (req:Request, res:Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // return res.status(400).send(errors.array());
            throw new RequestValidationError(errors.array())
        }
        const {email, password} = req.body;
        console.log("creating user");
        throw new DatabaseConnectionError();
        res.send({});
});

export {router as signupRouter};