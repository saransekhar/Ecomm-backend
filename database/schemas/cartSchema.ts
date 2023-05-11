import mongoose from "mongoose";
import {ICart} from "../models/ICart";

const cartSchema = new mongoose.Schema<ICart>({
    products: [
        {
            productObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products'},
            count: {type: Number, required: true},
            price: {type: String, required: true},
        }
    ],
    total: {type: String, required: true},
    tax: {type: String, required: true},
    grandTotal: {type: String, required: true},
    userObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'}
}, {timestamps: true});

const CartTable = mongoose.model<ICart>('carts', cartSchema);
export default CartTable;