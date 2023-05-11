import {Request, Response} from "express";
import {ResponseHandler} from "../util/ResponseHandler";
import {IUser} from "../database/models/IUser";
import {TokenHandler} from "../util/TokenHandler";
import {CategoryTable, SubCategoryTable} from "../database/schemas/categorySchema";
import {ICategory, ISubCategory} from "../database/models/ICategory";
import mongoose from "mongoose";

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
export const createCategory = async (request: Request, response: Response) => {
    try {
        const {name, description} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            // check if the category exists
            const category = await CategoryTable.findOne({name: name});
            if (category) {
                return ResponseHandler.sendErrors(response, 401, null, "Category is Already exists")
            }
            const newCategory: ICategory = {
                name: name,
                description: description,
                subCategories: []
            };
            const createdCategory = await new CategoryTable(newCategory).save();
            if (createdCategory) {
                return ResponseHandler.sendData(response, 200, createdCategory, "Category is Created");
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
export const createSubCategory = async (request: Request, response: Response) => {
    try {
        const {categoryId} = request.params;
        const {name, description} = request.body;
        const mongoCategoryId = new mongoose.Types.ObjectId(categoryId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const category: ICategory | any = await CategoryTable.findById(mongoCategoryId);
            if (!category) {
                return ResponseHandler.sendErrors(response, 404, null, "No Category found!");
            }
            // check if the sub-Category is exists
            const subCategory: ISubCategory | any = await SubCategoryTable.findOne({name: name});
            if (subCategory) {
                return ResponseHandler.sendErrors(response, 401, null, "SubCategory is Already exists");
            }
            // create SubCategory
            const createdSubCategory = await new SubCategoryTable({name: name, description: description}).save();
            if (createdSubCategory) {
                category.subCategories.push(createdSubCategory._id);
                const updatedCategory = await category.save();
                if (updatedCategory) {
                    return ResponseHandler.sendData(response, 200, createdSubCategory, "Sub-Category is Created");
                }
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllCategories = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const categories = await CategoryTable.find().populate({
                path: "subCategories",
                strictPopulate: false
            });
            return ResponseHandler.sendData(response, 200, categories, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}
