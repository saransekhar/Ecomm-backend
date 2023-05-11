import {Request, Response} from "express";
import {ResponseHandler} from "../util/ResponseHandler";
import {IUser} from "../database/models/IUser";
import {TokenHandler} from "../util/TokenHandler";
import CartTable from "../database/schemas/cartSchema";
import mongoose from "mongoose";
import {ICart} from "../database/models/ICart";

/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @body :products[{productObj, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
export const createCart = async (request: Request, response: Response) => {
    try {
        const {products, total, tax, grandTotal} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const cart = await CartTable.findOne({userObj: new mongoose.Types.ObjectId(user._id)});
            if (cart) {
                await CartTable.findByIdAndDelete(new mongoose.Types.ObjectId(cart._id));
            }
            // create a cart
            const newCart: ICart = {
                products: products,
                tax: tax,
                total: total,
                grandTotal: grandTotal,
                userObj: user._id
            };
            const createdCart = await new CartTable(newCart).save();
            if (createdCart) {
                const newCart = await CartTable.findById(new mongoose.Types.ObjectId(createdCart._id)).populate({
                    path: "products.productObj",
                    strictPopulate: false,
                }).populate({
                    path: "userObj",
                    strictPopulate: false,
                })
                return ResponseHandler.sendData(response, 200, newCart, "Cart is Created!");
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getCartInfo = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const cart = await CartTable.findOne({userObj: new mongoose.Types.ObjectId(user._id)});
            if (!cart) {
                return ResponseHandler.sendErrors(response, 200, null, "No Cart is found");
            }
            const newCart = await CartTable.findById(new mongoose.Types.ObjectId(cart._id)).populate({
                path: "products.productObj",
                strictPopulate: false,
            }).populate({
                path: "userObj",
                strictPopulate: false,
            })
            return ResponseHandler.sendData(response, 200, newCart, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}
