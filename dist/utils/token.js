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
exports.refreshAccessToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const mongodb_1 = require("mongodb");
const collections_1 = require("../mongo/collections");
const createToken = (user, SECRET_KEY, tokenType, expiresIn) => {
    const { _id, first_name, last_name, email, username, region_id, city_id, type, } = user;
    const payload = {
        token_type: tokenType,
        _id,
        first_name,
        last_name,
        email,
        username,
        region_id,
        city_id,
        type,
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn });
};
exports.createToken = createToken;
const refreshAccessToken = ({ input }, db) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = input;
    const { _id } = (0, jwt_decode_1.default)(token);
    const userFound = yield db
        .collection(collections_1.USER_COLLECTION)
        .findOne({ _id: new mongodb_1.ObjectId(_id) });
    if (!userFound)
        throw new Error("Error del servidor.");
    return {
        status: "SUCCESS",
        accessToken: (0, exports.createToken)(userFound, `${process.env.SECRET_KEY}`, "access", "24h"),
    };
});
exports.refreshAccessToken = refreshAccessToken;
