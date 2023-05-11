import mongoose from "mongoose";
import {IProduct} from "../models/IProduct";

const productSchema = new mongoose.Schema<IProduct>({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    brand: {type: String, required: true},
    price: {type: String, required: true},
    quantity: {type: String, required: true},
    sold: {type: Number, required: true, default: 0},
    userObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    categoryObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'categories'},
    subCategoryObj: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'subCategories'}
}, {timestamps: true});

const ProductTable = mongoose.model<IProduct>('products', productSchema);
export default ProductTable;