import { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
// import { loadSchemaSync } from "@graphql-tools/load";
import "graphql-import-node";
import resolvers from "./resolvers/resolversMap";
// import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import auth from "./schemas/auth.graphql";
import user from "./schemas/user.graphql";

// const typeDefs = loadSchemaSync("./**/*.graphql", {
// 	loaders: [new GraphQLFileLoader()],
// });

const typeDefs = [auth, user];

export const schema: GraphQLSchema = mergeSchemas({
	typeDefs: typeDefs,
	resolvers,
});
