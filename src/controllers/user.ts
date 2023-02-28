import User from "../models/user";

export const getUsers = async () => {
	const users = await User.find();
	return users;
};
