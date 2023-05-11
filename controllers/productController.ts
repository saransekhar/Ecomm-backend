import {Request, Response} from "express";
import {ResponseHandler} from "../util/ResponseHandler";
import {IUser} from "../database/models/IUser";
import {TokenHandler} from "../util/TokenHandler";
import {IProduct} from "../database/models/IProduct";
import ProductTable from "../database/schemas/productSchema";
import mongoose from "mongoose";

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
export const createProduct = async (request: Request, response: Response) => {
    try {
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // check if the product exists
            const product: IProduct | any = await ProductTable.findOne({title: title});
            if (product) {
                return ResponseHandler.sendErrors(response, 401, null, "The Product is Already Exists");
            }
            // create product
            const newProduct: IProduct = {
                title: title,
                description: description,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: user._id
            };
            const createdProduct = await new ProductTable(newProduct).save();
            if (createdProduct) {
                const theProduct: IProduct | any = await ProductTable.findById(new mongoose.Types.ObjectId(createdProduct._id)).populate({
                    path: "userObj",
                    strictPopulate: false
                }).populate({
                    path: "categoryObj",
                    strictPopulate: false
                }).populate({
                    path: "subCategoryObj",
                    strictPopulate: false
                });
                return ResponseHandler.sendData(response, 200, theProduct, "Product is Created Successfully")
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
export const updateProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // check if the product exists
            const product: IProduct | any = await ProductTable.findById(mongoProductId);
            if (!product) {
                return ResponseHandler.sendErrors(response, 404, null, "The Product is Not Found");
            }
            // update product
            const newProduct: IProduct = {
                title: title,
                description: description,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: user._id
            };
            const updatedProduct = await ProductTable.findByIdAndUpdate(mongoProductId, {$set: newProduct}, {new: true}).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (updatedProduct) {
                return ResponseHandler.sendData(response, 200, updatedProduct, "Product is Updated Successfully")
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProducts = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const products: IProduct[] | any = await ProductTable.find().populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return ResponseHandler.sendData(response, 200, products, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // check if the product exists
            const product: IProduct | any = await ProductTable.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!product) {
                return ResponseHandler.sendErrors(response, 404, null, "The Product is Not Found");
            }
            return ResponseHandler.sendData(response, 200, product, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // check if the product exists
            const product: IProduct | any = await ProductTable.findById(mongoProductId);
            if (!product) {
                return ResponseHandler.sendErrors(response, 404, null, "The Product is Not Found");
            }
            const deletedProduct = await ProductTable.findByIdAndDelete(mongoProductId);
            if (deletedProduct) {
                return ResponseHandler.sendData(response, 200, {}, "Product is Deleted");
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProductsWithCategoryId = async (request: Request, response: Response) => {
    try {
        const {categoryId} = request.params;
        const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const products = await ProductTable.find({categoryObj: mongoCategoryId}).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return ResponseHandler.sendData(response, 200, products, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}