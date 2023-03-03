// import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";
import auth from "./auth";
import user from "./user";

// const resolversFiles = loadFilesSync(__dirname);

const resolversFiles = [auth, user];

const resolvers = mergeResolvers(resolversFiles);

export default resolvers;
