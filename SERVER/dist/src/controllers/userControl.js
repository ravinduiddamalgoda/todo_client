"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.currentUser = void 0;
const user_service_1 = require("../services/user.service");
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    try {
        if (!currentUser) {
            return res.status(400).send({ err: "User not logged in" });
        }
        const userDoc = yield (0, user_service_1.findUserByEmail)(currentUser.email);
        const user = userDoc === null || userDoc === void 0 ? void 0 : userDoc.toJSON();
        user === null || user === void 0 ? true : delete user.password;
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).send({ err: err });
    }
});
exports.currentUser = currentUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fname, lname, password, email } = req.body;
        const existUser = yield (0, user_service_1.findUserByEmail)(email);
        if (existUser) {
            return res.status(400).send({
                err: "User Alrady Exists "
            });
        }
        const newUser = yield (0, user_service_1.register)(fname, lname, password, email, "User");
        res.status(201).send(newUser);
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const payload = yield (0, user_service_1.login)(password, email);
        res.status(201).send(payload);
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
exports.loginUser = loginUser;
