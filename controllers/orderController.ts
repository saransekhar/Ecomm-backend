import {Request, Response} from "express";
import {ResponseHandler} from "../util/ResponseHandler";
import {IUser} from "../database/models/IUser";
import {TokenHandler} from "../util/TokenHandler";
import mongoose from "mongoose";
import {IOrder} from "../database/models/IOrder";
import OrderTable from "../database/schemas/orderSchema";
import CartTable from "../database/schemas/cartSchema";

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @body : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
export const placeOrder = async (request: Request, response: Response) => {
    try {
        const {products, total, tax, grandTotal, paymentType} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // create an order
            const newOrder: IOrder = {
                products: products,
                tax: tax,
                total: total,
                grandTotal: grandTotal,
                orderBy: user._id,
                paymentType: paymentType
            };
            const createdOrder = await new OrderTable(newOrder).save();
            if (createdOrder) {
                // clear the cart
                const deletedCart = await CartTable.findOneAndRemove({userObj: new mongoose.Types.ObjectId(user._id)});
                if (deletedCart) {
                    // get order from db and send response
                    const newOrder = await OrderTable.findById(new mongoose.Types.ObjectId(createdOrder._id)).populate({
                        path: "products.productObj",
                        strictPopulate: false,
                    }).populate({
                        path: "orderBy",
                        strictPopulate: false,
                    })
                    return ResponseHandler.sendData(response, 200, newOrder, "Order is Created!");
                }
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const orders = await OrderTable.find().populate({
                path: "products.productObj",
                strictPopulate: false,
            }).populate({
                path: "orderBy",
                strictPopulate: false,
            }).sort({createdAt: 'descending'});
            return ResponseHandler.sendData(response, 200, orders, "");
        }
    } catch (error) {
        ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getMyOrders = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const mongoUserId = new mongoose.Types.ObjectId(user._id);
            const orders = await OrderTable.find({orderBy: mongoUserId}).populate({
                path: "products.productObj",
                strictPopulate: false,
            }).populate({
                path: "orderBy",
                strictPopulate: false,
            });
            return ResponseHandler.sendData(response, 200, orders, "");
        }
    } catch (error) {
        ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @body : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
export const updateOrderStatus = async (request: Request, response: Response) => {
    try {
        const {orderId} = request.params;
        const {orderStatus} = request.body;
        const mongoOrderId = new mongoose.Types.ObjectId(orderId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const order = await OrderTable.findById(mongoOrderId);
            if (!order) {
                return ResponseHandler.sendErrors(response, 404, null, "No Orders found");
            }
            order.orderStatus = orderStatus;
            const updatedOrder = await order.save();
            if (updatedOrder) {
                const theOrder = await OrderTable.findById(mongoOrderId).populate({
                    path: "products.productObj",
                    strictPopulate: false,
                }).populate({
                    path: "orderBy",
                    strictPopulate: false,
                });
                return ResponseHandler.sendData(response, 200, theOrder, "Order Status is Updated");
            }
        }
    } catch (error) {
        ResponseHandler.sendErrors(response, 500, error);
    }
}