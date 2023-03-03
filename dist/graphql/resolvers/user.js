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
const collections_1 = require("../../mongo/collections");
module.exports = {
    Query: {
        getUsers: (_, __, { db, token }) => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield db.collection(collections_1.USER_COLLECTION).find().toArray();
            return users;
        }),
    },
};
