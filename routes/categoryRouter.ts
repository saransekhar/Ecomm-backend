import {Request, Response, Router} from 'express';
import * as categoryController from "../controllers/categoryController";
import {body} from 'express-validator';
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const categoryRouter: Router = Router();

/**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
categoryRouter.post("/", [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('description').not().isEmpty().withMessage("Description is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await categoryController.createCategory(request, response);
});

/**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
categoryRouter.post("/:categoryId", [
    body('name').not().isEmpty().withMessage("Name is Required"),
    body('description').not().isEmpty().withMessage("Description is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await categoryController.createSubCategory(request, response);
});

/**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
categoryRouter.get("/", authMiddleware, async (request: Request, response: Response) => {
    await categoryController.getAllCategories(request, response);
});

export default categoryRouter;