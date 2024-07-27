import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError{
    statusCode = 400
    constructor(public errors: ValidationError[]){
        super("Request parameter error");

        // only becuase of we are extending built in calass(Error)
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors(){
        return this.errors.map(err=>{
            return {message: err.msg}
        })
    }
}