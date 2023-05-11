import mongoose from "mongoose";
import {ICategory, ISubCategory} from "../models/ICategory";

const subCategorySchema = new mongoose.Schema<ISubCategory>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true}
}, {timestamps: true});
export const SubCategoryTable = mongoose.model<ISubCategory>('subCategories', subCategorySchema, "subCategories");

const categorySchema = new mongoose.Schema<ICategory>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    subCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subCategories"
        }
    ]
}, {timestamps: true});
export const CategoryTable = mongoose.model<ICategory>('categories', categorySchema);


