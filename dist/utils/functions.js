"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = void 0;
const generateUsername = (first_name, last_name) => {
    const randomNum = `${Math.floor(Math.random() * 100)}`;
    const username = (first_name[0] +
        first_name[1] +
        first_name[2] +
        last_name +
        randomNum)
        .toLowerCase()
        .replace(" ", "");
    return username;
};
exports.generateUsername = generateUsername;
