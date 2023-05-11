import {Request, Response, Router} from 'express';
import * as userController from "../controllers/userController";
import {body} from 'express-validator';
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const userRouter: Router = Router();

/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @body : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post("/register", [
    body('username').isLength({min: 5}).withMessage("Proper Username is Required"),
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword().withMessage("Strong Password is Required"),
], validationMiddleware, async (request: Request, response: Response) => {
    await userController.registerUser(request, response);
})

/**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @body : email , password
 * @method : POST
 * @access : PUBLIC
 */
userRouter.post("/login", [
    body('email').isEmail().withMessage("Proper Email is Required"),
    body('password').isStrongPassword().withMessage("Strong Password is Required"),
], validationMiddleware, async (request: Request, response: Response) => {
    await userController.loginUser(request, response);
})


/**
 *  @usage : Get user Info
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @body : no-params
 *  @access : PRIVATE
 */
userRouter.get("/me", authMiddleware, async (request: Request, response: Response) => {
    await userController.getUserInfo(request, response);
});

/**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @body : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
userRouter.post("/profile", [
    body('imageUrl').not().isEmpty().withMessage("Image Url is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await userController.updateProfilePicture(request, response);
});

/**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @body : password
 * @method : POST
 * @access : PRIVATE
 */
userRouter.post("/change-password", [
    body('password').isStrongPassword().withMessage("Strong Password is Required")
], validationMiddleware, authMiddleware, async (request: Request, response: Response) => {
    await userController.changePassword(request, response);
});

export default userRouter;