export const typeDefs = `#graphql
	type User {
		_id: ID
		rut: String
		first_name: String
		last_name: String
		username: String
		email: String
		password: String
		type: String
		phone_number: String
		profile_image: String
		shipping_preference: [String]
		createdAt: String
	}

	type UserResult {
		status: String!
		message: String
		accessToken: String 
		refreshToken: String 
	}

	type TokenResult {
		status: String!
		accessToken: String 
	}

	input GoogleRegisterInput {
		token: String
		region_id: String
		city_id: String
	}

	input TokenInput {
		token: String
	}

	input UserInput {
		first_name: String!
		last_name: String
		email: String!
		password: String
		region_id: String!
		city_id: String!
	}

	input LoginInput {
		email: String!
		password: String!
	}

	type Query {
		# Users
		getUsers: [User]
	}

	type Mutation {
		# Auth
		register(input: UserInput): UserResult
		registerWithGoogle(input: GoogleRegisterInput): UserResult
		login(input: LoginInput): UserResult
		loginWithGoogle(input: TokenInput): UserResult
		refreshAccessToken(input: TokenInput): UserResult

		# Users
		# createUser(input: UserInput): UserResult
	}
`;
