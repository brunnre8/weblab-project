import { type UserID, type User, UserCreds } from "./models.ts";

export interface UserCredsWithID {
	creds: UserCreds;
	userID: UserID;
}

export interface UserStore {
	// get user from the store
	getUserById(id: UserID): Promise<User>;

	// get user credentials from the store
	getUserCredsByEmail(email: string): Promise<UserCredsWithID>;

	// insert user credentials into the store
	insertUserCreds(userID: UserID, creds: UserCreds): Promise<void>;

	// update user credentials
	updateUserCreds(userID: UserID, creds: UserCreds): Promise<void>;

	// List all users in the store
	listUsers(): Promise<User[]>;

	// report if there are users in the store
	hasUsers(): Promise<boolean>;

	// insert user to the store, returning primary key
	// if creds are passed, they are inserted in the same transaction
	insertUser(user: User, creds?: UserCreds): Promise<UserID>;

	// update user based on its primary key
	updateUser(user: User): Promise<void>;
}
