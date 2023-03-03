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
const mongodb_1 = require("mongodb");
const collections_1 = require("../../mongo/collections");
const functions_1 = require("../../utils/functions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../../utils/token");
const axios_1 = __importDefault(require("axios"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
module.exports = {
    Mutation: {
        register: (_, { input }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = input;
            newUser.email = newUser.email.toLocaleLowerCase();
            newUser.username = (0, functions_1.generateUsername)(newUser.first_name, newUser.last_name);
            const { email, username, password } = newUser;
            const foundEmail = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ email });
            if (foundEmail)
                throw new Error("El email ya está en uso.");
            const foundUsername = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ username });
            if (foundUsername)
                throw new Error("El nombre de usuario ya está en uso.");
            const salt = bcryptjs_1.default.genSaltSync(10);
            if (password) {
                newUser.password = yield bcryptjs_1.default.hash(password, salt);
            }
            try {
                newUser.type = "user";
                newUser.profile_image =
                    "https://s3.sa-east-1.amazonaws.com/www.matchbook.cl/avatars/no-avatar.png";
                const user = yield db
                    .collection(collections_1.USER_COLLECTION)
                    .insertOne(Object.assign({ rut: null }, newUser));
                return {
                    status: "SUCCESS",
                    message: "Usuario registrado con éxito.",
                    accessToken: (0, token_1.createToken)(user, `${process.env.SECRET_KEY}`, "access", "24h"),
                    refreshToken: (0, token_1.createToken)(user, `${process.env.SECRET_KEY}`, "refresh", "30d"),
                };
            }
            catch (error) {
                console.log(error);
            }
        }),
        registerWithGoogle: (_, { input }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const { token, region_id, city_id } = input;
            const decodedToken = yield axios_1.default.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            const { given_name, family_name, email, picture } = decodedToken.data;
            const username = (0, functions_1.generateUsername)(given_name, family_name);
            const foundEmail = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ email });
            if (foundEmail)
                throw new Error("El email ya está en uso.");
            const foundUsername = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ username });
            if (foundUsername)
                throw new Error("El nombre de usuario ya está en uso.");
            try {
                const user = yield db
                    .collection(collections_1.USER_COLLECTION)
                    .insertOne({
                    rut: null,
                    email: email,
                    first_name: given_name,
                    last_name: family_name,
                    password: null,
                    username: username,
                    type: "user",
                    profile_image: picture,
                    shipping_preference: [],
                    country_id: "i8HTiJW5exfDyQnhE1hJe",
                    region_id: region_id,
                    city_id: city_id,
                });
                return {
                    status: "SUCCESS",
                    message: "Usuario registrado con éxito.",
                    accessToken: (0, token_1.createToken)(user, `${process.env.SECRET_KEY}`, "access", "24h"),
                    refreshToken: (0, token_1.createToken)(user, `${process.env.SECRET_KEY}`, "refresh", "30d"),
                };
            }
            catch (error) {
                console.log(error);
            }
        }),
        login: (_, { input }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = input;
            const userFound = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ email: email.toLowerCase() });
            if (!userFound)
                throw new Error("Error en el email o contraseña");
            if (!userFound.password)
                throw new Error("Error email registrado con google");
            if (password && userFound.password) {
                const passwordSuccess = yield bcryptjs_1.default.compare(password, userFound.password);
                if (!passwordSuccess)
                    throw new Error("Error en el email o contraseña");
            }
            return {
                status: "SUCCESS",
                message: "Inicio de sesión exitoso.",
                accessToken: (0, token_1.createToken)(userFound, `${process.env.SECRET_KEY}`, "access", "24h"),
                refreshToken: (0, token_1.createToken)(userFound, `${process.env.SECRET_KEY}`, "refresh", "30d"),
            };
        }),
        loginWithGoogle: (_, { input }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const { token } = input;
            const decodedToken = yield axios_1.default.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            const { email } = decodedToken.data;
            const userFound = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ email: email.toLowerCase() });
            if (!userFound)
                throw new Error("Error usuario no encontrado");
            console.log(userFound.password);
            if (userFound.password)
                throw new Error("Error usuario registrado con google");
            return {
                status: "SUCCESS",
                message: "Inicio de sesión exitoso.",
                accessToken: (0, token_1.createToken)(userFound, `${process.env.SECRET_KEY}`, "access", "24h"),
                refreshToken: (0, token_1.createToken)(userFound, `${process.env.SECRET_KEY}`, "refresh", "30d"),
            };
        }),
        refreshAccessToken: (_, { input }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const { token } = input;
            const { _id } = (0, jwt_decode_1.default)(token);
            const userFound = yield db
                .collection(collections_1.USER_COLLECTION)
                .findOne({ _id: new mongodb_1.ObjectId(_id) });
            if (!userFound)
                throw new Error("Error del servidor.");
            return {
                status: "SUCCESS",
                accessToken: (0, token_1.createToken)(userFound, `${process.env.SECRET_KEY}`, "access", "24h"),
            };
        }),
    },
};
