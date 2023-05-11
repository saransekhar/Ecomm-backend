import {Request, Response, Router} from 'express';
import * as cartController from "../controllers/cartController";
import {body} from 'express-validator';
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const cartRouter: Router = Router();

/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @body :products[{product, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
cartRouter.post("/", [
    body('products').not().isEmpty().withMessage("Products is Required"),
    body('total').not().isEmpty().withMessage("Total is Required"),
    body('tax').not().isEmpty().withMessage("Tax is Required"),
    body('grandTotal').not().isEmpty().withMessage("Grand Total is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await cartController.createCart(request, response);
});

/**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
cartRouter.get("/me", authMiddleware, async (request: Request, response: Response) => {
    await cartController.getCartInfo(request, response);
});

export default cartRouter;
