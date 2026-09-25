import type { UserID } from "../users/models.ts";

export type AuthTokenString = string;

export interface AuthToken {
	userID: UserID;
	token: AuthTokenString;
	createdAt: Date;
}

export interface AuthTokenStore {
	// store AuthToken for user
	addAuthToken(token: AuthToken): Promise<void>;

	// delete token
	deleteAuthToken(token: AuthTokenString): Promise<void>;

	// delete all access token for a user
	deleteAllAuthTokens(userID: UserID): Promise<void>;

	// get token
	getAuthToken(token: AuthTokenString): Promise<AuthToken>;
}
