import {Request, Response, Router} from 'express';
import * as productController from "../controllers/productController";
import {body} from 'express-validator';
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const productRouter: Router = Router();

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
productRouter.post("/", [
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('description').not().isEmpty().withMessage("Description is Required"),
    body('imageUrl').not().isEmpty().withMessage("ImageUrl is Required"),
    body('brand').not().isEmpty().withMessage("Brand is Required"),
    body('price').not().isEmpty().withMessage("Price is Required"),
    body('quantity').not().isEmpty().withMessage("Quantity is Required"),
    body('categoryId').not().isEmpty().withMessage("CategoryId is Required"),
    body('subCategoryId').not().isEmpty().withMessage("SubCategoryId is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await productController.createProduct(request, response);
})


/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
productRouter.put("/:productId", [
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('description').not().isEmpty().withMessage("Description is Required"),
    body('imageUrl').not().isEmpty().withMessage("ImageUrl is Required"),
    body('brand').not().isEmpty().withMessage("Brand is Required"),
    body('price').not().isEmpty().withMessage("Price is Required"),
    body('quantity').not().isEmpty().withMessage("Quantity is Required"),
    body('categoryId').not().isEmpty().withMessage("CategoryId is Required"),
    body('subCategoryId').not().isEmpty().withMessage("SubCategoryId is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await productController.updateProduct(request, response);
})

/**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
productRouter.get("/", authMiddleware, async (request: Request, response: Response) => {
    await productController.getAllProducts(request, response);
})


/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
productRouter.get("/:productId", authMiddleware, async (request: Request, response: Response) => {
    await productController.getProduct(request, response);
})

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
productRouter.delete("/:productId", authMiddleware, async (request: Request, response: Response) => {
    await productController.deleteProduct(request, response);
})

/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
productRouter.get("/categories/:categoryId", authMiddleware, async (request: Request, response: Response) => {
    await productController.getAllProductsWithCategoryId(request, response);
})


export default productRouter;
