export const generateUsername = (
	first_name: string,
	last_name: string
): string => {
	const randomNum = `${Math.floor(Math.random() * 100)}`;
	const username = (
		first_name[0] +
		first_name[1] +
		first_name[2] +
		last_name +
		randomNum
	)
		.toLowerCase()
		.replace(" ", "");
	return username;
};
