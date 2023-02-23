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
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const db_1 = require("./src/utils/db");
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./src/graphql/typeDefs");
const resolver_1 = require("./src/graphql/resolver");
const http = require("http");
const isAuth = require('./src/middleware/isauth');
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(user_route_1.default);
app.use(isAuth);
let apolloServer = null;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        apolloServer = new apollo_server_express_1.ApolloServer({
            typeDefs: typeDefs_1.typeDefs,
            resolvers: resolver_1.resolvers,
            context: ({ res, req }) => ({
                req, res
            })
        });
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app });
    });
}
startServer();
const httpserver = http.createServer(app);
(0, db_1.connect)().then(() => {
    console.log("Database Connected");
    app.listen(5000, () => { console.log("Server 01 Started"); });
})
    .catch(err => {
    console.error("Connection ERROR", err);
});
