import { type UserID, type User } from "./models.ts";

export interface UserStore {
	// get user from the store
	getUserById(id: UserID): Promise<User>;

	// get user from the store
	getUserByEmail(email: string): Promise<User>;

	// List all users in the store
	listUsers(): Promise<User[]>;

	// insert user to the store, returning primary key
	insertUser(user: User): Promise<UserID>;

	// update user based on its primary key
	updateUser(user: User): Promise<void>;
}
