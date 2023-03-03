import { Types } from "mongoose";

export interface UserInputProps {
	input: User;
}

export interface GoogleRegisterInputProps {
	input: Token;
}

export interface TokenInput {
	input: Token;
}

export interface Token {
	token: string;
}

export interface Token {
	token_type: string;
	_id: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	type: string;
}

export interface User {
	_id: Types.ObjectId;
	rut?: string;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password?: string;
	type?: string;
	phone_number?: string;
	profile_image?: string;
	createdAt: number;
}
