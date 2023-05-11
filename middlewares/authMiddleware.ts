import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import {APP_CONSTANTS} from "../constants";

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token: any = request.headers[APP_CONSTANTS.REQUEST_TOKEN_HEADER];
        if (!token) {
            return response.status(401).json({msg: "No Token Provided"})
        }
        const secretKey: string | undefined = process.env.EXPRESS_JWT_SECRET_KEY;
        if (secretKey) {
            const decode: any = jwt.verify(token, secretKey, {algorithms: ["HS256"]});
            if (decode) {
                request.headers[APP_CONSTANTS.JWT_USER_PAYLOAD] = decode.user;
                next(); // forward to the router
            } else {
                return response.status(401).json({msg: "Invalid Token Provided"})
            }
        }
    } catch (error) {
        return response.status(500).json({msg: "Token validation failed"})
    }
};