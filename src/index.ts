import { connect } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./gql/typeDefs";
import { resolvers } from "./gql/resolvers";
import { Context } from "./interfaces/globalInterfaces";

connect(`${process.env.MONGO_URI}`);
// mongoose.connect(process.env.BBDD, (err: Error): void => {
// 	if (err) console.log("Error de conexión", err);
// 	else console.log("Conexión Correcta");
// });

const server = new ApolloServer<Context>({
	typeDefs,
	resolvers,
});

const getHeaders = (token: string | undefined) => {
	// console.log({ token });
	if (token) {
		try {
			const user = jwt.verify(
				token.replace("Bearer ", ""),
				`${process.env.SECRET_KEY}`
			);

			return {
				user,
			};
		} catch (error: any) {
			console.log("#### ERROR ####");
			console.log(error);
			throw new Error("Token inválido.");
		}
	}
};

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => ({
		headers: getHeaders(req.headers.authorization),
	}),
});

console.log(`🚀  Server ready at: ${url}`);
