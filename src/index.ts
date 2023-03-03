import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql";
import depthLimit from "graphql-depth-limit";
import MongoLib from "./mongo";
import config from "./config";

const app = express();
app.use(cors());

const context: any = async ({ req, connection }: any) => {
	// Agregando al contexto el token para añadirlo en headers por authorization.
	const token = req ? req.headers.authorization : connection.authorization;

	return { db: await new MongoLib().connect(), token };
};

let server;
const startServer = async () => {
	server = new ApolloServer({
		schema,
		introspection: true,
		context,
		validationRules: [depthLimit(4)],
	});
	await server.start();
	server.applyMiddleware({ app });
};

startServer();

app.listen(config.port, () => {
	console.log(`http://localhost:${config.port}/graphql`);
});
