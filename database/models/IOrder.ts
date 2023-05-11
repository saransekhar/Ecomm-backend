import {ICartProduct} from "./ICart";
import mongoose from "mongoose";

export interface IOrder {
    _id?: string;
    products: ICartProduct[];
    total: string;
    tax: string;
    grandTotal: string;
    paymentType: string;
    orderStatus?: string,
    orderBy: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}