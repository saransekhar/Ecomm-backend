import mongoose from "mongoose";

export interface ICart {
    _id?: string;
    products: ICartProduct[];
    total: string;
    tax: string;
    grandTotal: string;
    userObj: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICartProduct {
    productObj: mongoose.Schema.Types.ObjectId;
    count: number;
    price: string;
}
