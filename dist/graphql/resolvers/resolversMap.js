"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const resolversFiles = [auth_1.default, user_1.default];
const resolvers = (0, merge_1.mergeResolvers)(resolversFiles);
exports.default = resolvers;
