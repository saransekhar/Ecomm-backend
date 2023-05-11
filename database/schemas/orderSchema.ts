import mongoose from "mongoose";
import {IOrder} from "../models/IOrder";

const orderSchema = new mongoose.Schema<IOrder>({
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
    paymentType: {type: String, required: true},
    orderStatus: {
        type: String, required: true,
        default: "Order Placed",
        enum: [
            "Order Placed",
            "Processing",
            "Dispatched",
            "Delivered",
            "Cancelled",
            "Completed"
        ]
    },
    orderBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'}
}, {timestamps: true});

const OrderTable = mongoose.model<IOrder>('orders', orderSchema);
export default OrderTable;