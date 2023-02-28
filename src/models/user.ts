import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	rut: {
		type: String,
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		trim: true,
	},
	type: {
		type: String,
	},
	phone_number: {
		type: String,
	},
	profile_image: {
		type: String,
	},
	region_id: {
		type: String,
		required: true,
	},
	city_id: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Number,
		default: Date.now(),
	},
});

// UserSchema.pre("remove", function (next) {
// 	// 'this' is the client being removed. Provide callbacks here if you want
// 	// to be notified of the calls' result.
// 	Balance.remove({ user_id: this._id }).exec();
// 	next();
// });

export default mongoose.model("User", UserSchema);
