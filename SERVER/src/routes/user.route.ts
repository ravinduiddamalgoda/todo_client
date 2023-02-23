import { Router } from "express";
import { currentUser, loginUser, registerUser } from "../controllers/userControl";
import { authGuard, validate } from "../utils/validater";
import { body } from "express-validator/src/middlewares/validation-chain-builders";

const userRouter = Router();

userRouter.post('/register', validate([
    body("email").isEmail(),
    body("password").isLength({min :5})
]), registerUser );


userRouter.post('/login',loginUser); 

userRouter.get('/current-user',authGuard, currentUser)

export default userRouter;