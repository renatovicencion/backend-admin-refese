"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
require("graphql-import-node");
const resolversMap_1 = __importDefault(require("./resolvers/resolversMap"));
const auth_graphql_1 = __importDefault(require("./schemas/auth.graphql"));
const user_graphql_1 = __importDefault(require("./schemas/user.graphql"));
const typeDefs = [auth_graphql_1.default, user_graphql_1.default];
exports.schema = (0, schema_1.mergeSchemas)({
    typeDefs: typeDefs,
    resolvers: resolversMap_1.default,
});
