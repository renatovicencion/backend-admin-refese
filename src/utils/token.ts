import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import User from "../models/user";

import {
	Token,
	TokenInput,
	User as UserType,
} from "./../interfaces/userInterfaces";

export const createToken = (
	user: UserType,
	SECRET_KEY: string,
	tokenType: string,
	expiresIn: string
) => {
	const {
		_id,
		first_name,
		last_name,
		email,
		username,
		region_id,
		city_id,
		type,
	} = user;
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

	return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const refreshAccessToken = async ({ input }: TokenInput) => {
	const { token } = input;

	const { _id } = jwtDecode<Token>(token);

	// Comprobando si usuario existe
	const userFound = await User.findOne({ _id: _id });
	if (!userFound) throw new Error("Error del servidor.");

	return {
		status: "SUCCESS",
		accessToken: createToken(
			userFound,
			`${process.env.SECRET_KEY}`,
			"access",
			"24h"
		),
	};
};
