import {NextFunction, Request, Response} from "express";
import {validationResult} from 'express-validator';

export const validationMiddleware = (request:Request, response:Response, next:NextFunction) => {
    // validate the form
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }
    else{
        next();
    }
}