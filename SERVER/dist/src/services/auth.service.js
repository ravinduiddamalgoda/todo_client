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
exports.verfyToken = exports.singToken = exports.validatePassword = exports.createPasswordHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const APP_SECRET = 'my-todo-app-secret';
const APP_ACCESS_TOKEN_EXP_SECS = 3600;
const JWT_OPTION = {
    algorithm: "HS256",
    issuer: "mytodoapp.cm/api",
    audience: "mytodoapp.com",
    expiresIn: 3600
};
function createPasswordHash(password) {
    return bcrypt_1.default.hash(password, 10);
}
exports.createPasswordHash = createPasswordHash;
function validatePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
exports.validatePassword = validatePassword;
function singToken(password, hash, payloard) {
    return __awaiter(this, void 0, void 0, function* () {
        const isValidePassword = validatePassword(password, hash);
        if (!isValidePassword) {
            throw new Error("Invalid Password");
        }
        const token = jsonwebtoken_1.default.sign(payloard, APP_SECRET, JWT_OPTION);
        return {
            token,
            life: APP_ACCESS_TOKEN_EXP_SECS
        };
    });
}
exports.singToken = singToken;
function verfyToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, APP_SECRET, JWT_OPTION);
    return payload;
}
exports.verfyToken = verfyToken;
