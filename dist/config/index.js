"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    dbName: process.env.DB_NAME,
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
};
exports.default = config;
