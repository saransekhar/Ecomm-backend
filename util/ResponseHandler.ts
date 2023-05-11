import {Response} from "express";
import {APP_CONSTANTS} from "../constants";

export class ResponseHandler {

    public static sendErrors(response: Response, statusCode: number, error: any, msg?: string | undefined) {
        return response.status(statusCode ? statusCode : 500).json({
            status: APP_CONSTANTS.FAILED,
            data: null,
            error: error,
            msg: msg ? msg : ""
        })
    }

    public static sendData(response: Response, statusCode: number, data: any, msg?: string | undefined) {
        return response.status(statusCode ? statusCode : 200).json({
            status: APP_CONSTANTS.SUCCESS,
            data: data,
            msg: msg ? msg : ""
        })
    }
}