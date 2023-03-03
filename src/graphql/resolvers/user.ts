import { Db } from "mongodb";
import { USER_COLLECTION } from "../../mongo/collections";

export = {
	Query: {
		// User
		getUsers: async (
			_: any,
			__: any,
			{ db, token }: { db: Db; token: any }
		) => {
			const users = await db.collection(USER_COLLECTION).find().toArray();
			return users;
		},
	},
};
