"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControl_1 = require("../controllers/userControl");
const validater_1 = require("../utils/validater");
const validation_chain_builders_1 = require("express-validator/src/middlewares/validation-chain-builders");
const userRouter = (0, express_1.Router)();
userRouter.post('/register', (0, validater_1.validate)([
    (0, validation_chain_builders_1.body)("email").isEmail(),
    (0, validation_chain_builders_1.body)("password").isLength({ min: 5 })
]), userControl_1.registerUser);
userRouter.post('/login', userControl_1.loginUser);
userRouter.get('/current-user', validater_1.authGuard, userControl_1.currentUser);
exports.default = userRouter;
