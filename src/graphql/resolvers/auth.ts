// Controllers
import { Db, ObjectId } from "mongodb";

import {
	UserInputProps,
	Token,
	TokenInput,
	GoogleRegisterInputProps,
} from "../../interfaces/userInterfaces";

import { USER_COLLECTION } from "../../mongo/collections";
import { generateUsername } from "../../utils/functions";
import bcryptjs from "bcryptjs";
import { createToken } from "../../utils/token";
import axios from "axios";
import jwtDecode from "jwt-decode";

export = {
	Mutation: {
		//  Auth
		register: async (
			_: any,
			{ input }: UserInputProps,
			{ db }: { db: Db }
		) => {
			const newUser = input;

			newUser.email = newUser.email.toLocaleLowerCase();
			newUser.username = generateUsername(
				newUser.first_name,
				newUser.last_name
			);

			const { email, username, password } = newUser;

			// Revisamos si el email está en uso
			const foundEmail = await db
				.collection(USER_COLLECTION)
				.findOne({ email });
			if (foundEmail) throw new Error("El email ya está en uso.");

			// Revisamos si el username está en uso
			const foundUsername = await db
				.collection(USER_COLLECTION)
				.findOne({ username });
			if (foundUsername)
				throw new Error("El nombre de usuario ya está en uso.");

			// Encriptación de contraseña
			const salt = bcryptjs.genSaltSync(10);

			if (password) {
				newUser.password = await bcryptjs.hash(password, salt);
			}

			try {
				newUser.type = "user";
				newUser.profile_image =
					"https://s3.sa-east-1.amazonaws.com/www.matchbook.cl/avatars/no-avatar.png";

				const user: any = await db
					.collection(USER_COLLECTION)
					.insertOne({ rut: null, ...newUser });

				// await user.save();

				return {
					status: "SUCCESS",
					message: "Usuario registrado con éxito.",
					accessToken: createToken(
						user,
						`${process.env.SECRET_KEY}`,
						"access",
						"24h"
					),
					refreshToken: createToken(
						user,
						`${process.env.SECRET_KEY}`,
						"refresh",
						"30d"
					),
				};
			} catch (error) {
				console.log(error);
			}
		},
		registerWithGoogle: async (
			_: any,
			{ input }: GoogleRegisterInputProps,
			{ db }: { db: Db }
		) => {
			const { token } = input;

			const decodedToken = await axios.post(
				`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
			);

			const { given_name, family_name, email, picture } =
				decodedToken.data;

			const username = generateUsername(given_name, family_name);

			// Revisamos si el email está en uso
			const foundEmail = await db
				.collection(USER_COLLECTION)
				.findOne({ email });
			if (foundEmail) throw new Error("El email ya está en uso.");

			// Revisamos si el username está en uso
			const foundUsername = await db
				.collection(USER_COLLECTION)
				.findOne({ username });
			if (foundUsername)
				throw new Error("El nombre de usuario ya está en uso.");

			try {
				const user: any = await db
					.collection(USER_COLLECTION)
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
					});
				// await user.save();

				return {
					status: "SUCCESS",
					message: "Usuario registrado con éxito.",
					accessToken: createToken(
						user,
						`${process.env.SECRET_KEY}`,
						"access",
						"24h"
					),
					refreshToken: createToken(
						user,
						`${process.env.SECRET_KEY}`,
						"refresh",
						"30d"
					),
				};
			} catch (error) {
				console.log(error);
			}
		},
		login: async (
			_: any,
			{ input }: UserInputProps,
			{ db }: { db: Db }
		) => {
			const { email, password } = input;

			// Comprobando si usuario existe
			const userFound: any = await db
				.collection(USER_COLLECTION)
				.findOne({ email: email.toLowerCase() });
			if (!userFound) throw new Error("Error en el email o contraseña");

			// Si password del usuario encontrado es null, entonces la cuenta fue creada con google
			if (!userFound.password)
				throw new Error("Error email registrado con google");
			// Verificar coincidencia en contraseña
			if (password && userFound.password) {
				const passwordSuccess = await bcryptjs.compare(
					password,
					userFound.password
				);
				if (!passwordSuccess)
					throw new Error("Error en el email o contraseña");
			}

			// Si pasa las validaciones se retorna el token
			return {
				status: "SUCCESS",
				message: "Inicio de sesión exitoso.",
				accessToken: createToken(
					userFound,
					`${process.env.SECRET_KEY}`,
					"access",
					"24h"
				),
				refreshToken: createToken(
					userFound,
					`${process.env.SECRET_KEY}`,
					"refresh",
					"30d"
				),
			};
		},
		loginWithGoogle: async (
			_: any,
			{ input }: TokenInput,
			{ db }: { db: Db }
		) => {
			const { token } = input;

			const decodedToken = await axios.post(
				`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
			);

			const { email } = decodedToken.data;
			// Comprobando si usuario existe
			const userFound: any = await db
				.collection(USER_COLLECTION)
				.findOne({ email: email.toLowerCase() });
			if (!userFound) throw new Error("Error usuario no encontrado");

			console.log(userFound.password);
			// Comprobando si usuario se creo con Google
			if (userFound.password)
				throw new Error("Error usuario registrado con google");

			// Si pasa las validaciones se retorna el token
			return {
				status: "SUCCESS",
				message: "Inicio de sesión exitoso.",
				accessToken: createToken(
					userFound,
					`${process.env.SECRET_KEY}`,
					"access",
					"24h"
				),
				refreshToken: createToken(
					userFound,
					`${process.env.SECRET_KEY}`,
					"refresh",
					"30d"
				),
			};
		},
		refreshAccessToken: async (
			_: any,
			{ input }: TokenInput,
			{ db }: { db: Db }
		) => {
			const { token } = input;

			const { _id } = jwtDecode<Token>(token);

			// Comprobando si usuario existe
			const userFound: any = await db
				.collection(USER_COLLECTION)
				.findOne({ _id: new ObjectId(_id) });
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
		},
	},
};
