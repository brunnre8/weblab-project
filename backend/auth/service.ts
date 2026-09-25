import { randomBytes } from "crypto";
import type { User, UserID } from "../users/models.ts";
import type { UserService } from "../users/service.ts";
import type { AuthToken, AuthTokenStore, AuthTokenString } from "./tokenStore.ts";
import { ErrNoEnt, ErrPerm } from "../middlewares/errors.ts";
import { ErrNoRows } from "../stores/errors.ts";

export class ErrInvalidCredentials extends Error {}
export interface UserAndToken {
	user: User;
	authToken: AuthToken;
}

export class AuthService {
	#userService: UserService;
	#tokenStore: AuthTokenStore;

	constructor(userService: UserService, authTokenStore: AuthTokenStore) {
		this.#userService = userService;
		this.#tokenStore = authTokenStore;
	}

	async login(email: string, password: string): Promise<UserAndToken> {
		const user = await this.#userService.userFromLogin(email, password);
		if (user === null) {
			throw new ErrInvalidCredentials("email / pw missmatch");
		}
		if (user.disabled) {
			throw new ErrPerm(`user ${user.email} is disabled`);
		}
		const token = await newAuthToken(user.id);
		this.#tokenStore.addAuthToken(token);
		return { authToken: token, user: user };
	}

	async userFromToken(raw: AuthTokenString): Promise<User | null> {
		try {
			const token = await this.#tokenStore.getAuthToken(raw);
			if (isTokenExpired(token)) {
				await this.#tokenStore.deleteAuthToken(token.token);
				return null;
			}
			const user = await this.#userService.getUser(token.userID);
			return user;
		} catch (err) {
			if (err instanceof ErrNoRows || err instanceof ErrNoEnt) {
				return null;
			}
			throw err; // internal error, bubble up
		}
	}

	async logout(token: AuthTokenString): Promise<void> {
		try {
			await this.#tokenStore.deleteAuthToken(token);
		} catch (err) {
			if (err instanceof ErrNoRows) {
				throw new ErrNoEnt("no such token", { cause: err });
			}
			throw err;
		}
	}
}

async function newAuthToken(id: UserID): Promise<AuthToken> {
	return {
		userID: id,
		token: await genRandom(TOKEN_BYTES),
		createdAt: new Date(),
	};
}

const TOKEN_BYTES = 64;

export async function genRandom(numBytes: number): Promise<string> {
	return new Promise((resolve, reject) => {
		randomBytes(numBytes, (err, buf) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(buf.toString("base64url"));
		});
	});
}

function isTokenExpired(token: AuthToken): boolean {
	const now = new Date();
	const delta = now.getTime() - token.createdAt.getTime();
	return delta > 31 * 24 * 60 * 1000;
}
