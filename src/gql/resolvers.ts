// Controllers
import {
	login,
	loginWithGoogle,
	register,
	registerWithGoogle,
} from "../controllers/auth";
import { getUsers } from "../controllers/user";

// Interfaces
import { Context } from "../interfaces/globalInterfaces";
import {
	UserInputProps,
	TokenInput,
	GoogleRegisterInputProps,
} from "./../interfaces/userInterfaces";

import { refreshAccessToken } from "../utils/token";

export const resolvers = {
	Query: {
		// User
		getUsers: () => getUsers(),
	},
	Mutation: {
		//  Auth
		register: (_: any, { input }: UserInputProps) => register({ input }),
		registerWithGoogle: (_: any, { input }: GoogleRegisterInputProps) =>
			registerWithGoogle({ input }),
		login: (_: any, { input }: UserInputProps) => login({ input }),
		loginWithGoogle: (_: any, { input }: TokenInput) =>
			loginWithGoogle({ input }),
		refreshAccessToken: (_: any, { input }: TokenInput) =>
			refreshAccessToken({ input }),

		// User
		// createUser: (
		// 	_: any,
		// 	{ input }: UserInputProps,
		// 	ctx: Context
		// ) => createUser({ input, ctx }),
	},
};
