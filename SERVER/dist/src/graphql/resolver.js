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
exports.resolvers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const todo_model_1 = __importDefault(require("../models/todo.model"));
const apollo_server_errors_1 = require("apollo-server-errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.resolvers = {
    Query: {
        getUsers() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield user_model_1.default.find();
            });
        },
        getUserById(_, { ID }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield user_model_1.default.findById(ID);
            });
        },
        getTodo() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield todo_model_1.default.find();
            });
        },
    },
    Mutation: {
        registerUser(_, { userInput: { fname, lname, password, email, role } }) {
            return __awaiter(this, void 0, void 0, function* () {
                const oldeUser = yield user_model_1.default.findOne({ email });
                if (oldeUser) {
                    throw new apollo_server_errors_1.ApolloError("A user is alrady registered with the email" + email, "USER_ALRADY_EXSITS");
                }
                var encryptedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = new user_model_1.default({
                    fname: fname,
                    lname: lname,
                    password: encryptedPassword,
                    email: email.toLowerCase(),
                    role: role,
                });
                yield newUser.save();
                return newUser;
            });
        },
        userLogin(_, { loginInput: { email, password } }) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield user_model_1.default.findOne({ email });
                if (user && (yield bcrypt_1.default.compare(password, user.password))) {
                    var token = jsonwebtoken_1.default.sign({ user_id: user._id, email }, "SUPER_SECRET", {
                        expiresIn: "3000",
                    });
                    user.token = token;
                    return user;
                }
                else {
                    throw new apollo_server_errors_1.ApolloError("Incorrect password", "INCORRECT_PASSOWRD");
                }
            });
        },
        createTodo: (_, { todoInput: { title } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth) {
                throw new Error("Unauthenticated");
            }
            const newTodo = new todo_model_1.default({
                title: title,
            });
            yield newTodo.save();
            return newTodo;
        }),
        editTodo(_, { _id, editInput }, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!req.isAuth) {
                    throw new Error("Unauthenticated");
                }
                return yield todo_model_1.default.findOneAndUpdate({ _id }, editInput, { new: true });
            });
        },
        deleteTodo(_, { _id }, { req }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!req.isAuth) {
                    throw new Error("Unauthenticated");
                }
                return yield todo_model_1.default.findByIdAndRemove({ _id });
            });
        },
    },
};
module.exports = { resolvers: exports.resolvers };
