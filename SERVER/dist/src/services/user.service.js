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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.findUserByEmail = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_service_1 = require("./auth.service");
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const existUser = yield user_model_1.default.findOne({ email });
        return existUser;
    });
}
exports.findUserByEmail = findUserByEmail;
function register(fname, lname, password, email, role) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield (0, auth_service_1.createPasswordHash)(password);
        const newUser = new user_model_1.default({
            fname,
            lname,
            password: hash,
            email,
            role: "User"
        });
        const userPayload = JSON.parse(JSON.stringify(newUser));
        if (userPayload) {
            delete userPayload.password;
        }
        yield newUser.save();
        return userPayload;
    });
}
exports.register = register;
function login(password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const acc = yield user_model_1.default.findOne({ email });
        if (!acc) {
            throw new Error("User Not Found");
        }
        const payload = yield (0, auth_service_1.singToken)(password, acc.password, {
            email: acc.email,
            id: __dirname.toString(),
            role: acc.role
        });
        return payload;
    });
}
exports.login = login;
