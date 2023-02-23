"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
module.exports = (context) => {
    const authHeader = context.req.header.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearrer')[1];
        if (token) {
            try {
                const user = jsonwebtoken_1.default.verify(token, 'UNSAFE_STRING');
                return user;
            }
            catch (err) {
                throw new apollo_server_errors_1.AuthenticationError('Invalid/Expire token');
            }
        }
        throw new Error("Authentication token must be 'Bearer' [token]");
    }
    throw new Error('Authentiction header must be provided');
};
