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
exports.authGuard = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const validate = (validation) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validation.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ err: errors });
    });
};
exports.validate = validate;
const authGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return res.status(400).send({
            err: 'forbineded Rrsources'
        });
    }
    try {
        const payload = yield (0, auth_service_1.verfyToken)(authToken.split('Bearer ')[1]);
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
exports.authGuard = authGuard;
