import {Request, Response, Router} from 'express';
import * as orderController from "../controllers/orderController";
import {body} from 'express-validator';
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const orderRouter: Router = Router();

/**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @body : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
orderRouter.post("/place", [
    body('products').not().isEmpty().withMessage("Products is Required"),
    body('total').not().isEmpty().withMessage("Total is Required"),
    body('tax').not().isEmpty().withMessage("Tax is Required"),
    body('grandTotal').not().isEmpty().withMessage("Grand Total is Required"),
    body('paymentType').not().isEmpty().withMessage("PaymentType is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await orderController.placeOrder(request, response);
});

/**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
orderRouter.get("/all", authMiddleware, async (request: Request, response: Response) => {
    await orderController.getAllOrders(request, response);
});

/**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
orderRouter.get("/me", authMiddleware, async (request: Request, response: Response) => {
    await orderController.getMyOrders(request, response);
});

/**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @body : orderStatus
 * @method : POST
 * @access : PRIVATE
 */
orderRouter.post("/:orderId", [
    body('orderStatus').not().isEmpty().withMessage("Order Status is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await orderController.updateOrderStatus(request, response);
});

export default orderRouter;
