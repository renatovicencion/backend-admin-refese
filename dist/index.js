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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("./graphql");
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const mongo_1 = __importDefault(require("./mongo"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const context = ({ req, connection }) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req ? req.headers.authorization : connection.authorization;
    return { db: yield new mongo_1.default().connect(), token };
});
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    server = new apollo_server_express_1.ApolloServer({
        schema: graphql_1.schema,
        introspection: true,
        context,
        validationRules: [(0, graphql_depth_limit_1.default)(4)],
    });
    yield server.start();
    server.applyMiddleware({ app });
});
startServer();
app.listen(config_1.default.port, () => {
    console.log(`http://localhost:${config_1.default.port}/graphql`);
});
