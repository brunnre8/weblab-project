import { type UserID, type User, UserCreds } from "./models.ts";

export interface UserStore {
	// get user from the store
	getUserById(id: UserID): Promise<User>;

	// get user credentials from the store
	getUserCredsByEmail(email: string): Promise<UserCreds>;

	// List all users in the store
	listUsers(): Promise<User[]>;

	// insert user to the store, returning primary key
	insertUser(user: User): Promise<UserID>;

	// update user based on its primary key
	updateUser(user: User): Promise<void>;
}
