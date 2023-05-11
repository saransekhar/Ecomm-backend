import {APP_CONSTANTS} from "../constants";
import mongoose from "mongoose";
import {IUser} from "../database/models/IUser";
import UserTable from "../database/schemas/userSchema";
import {Request} from "express";

export class TokenHandler {
    public static async getUserData(request: Request): Promise<IUser | undefined | null | any> {
        const payload: any = request.headers[APP_CONSTANTS.JWT_USER_PAYLOAD];
        const {id} = payload;
        const mongoUserId = new mongoose.Types.ObjectId(id);
        const user: IUser | undefined | null = await UserTable.findById(mongoUserId);
        return user;
    }
}