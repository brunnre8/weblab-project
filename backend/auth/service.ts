import { randomBytes } from "crypto";
import type { User, UserID } from "../users/models.ts";
import type { UserService } from "../users/service.ts";
import type { AuthToken, AuthTokenStore, AuthTokenString } from "./tokenStore.ts";
import { ErrNoEnt, ErrPerm } from "../middlewares/errors.ts";
import { ErrNoRows } from "../stores/errors.ts";

export class ErrInvalidCredentials extends Error {}

export class AuthService {
	#userService: UserService;
	#tokenStore: AuthTokenStore;

	constructor(userService: UserService, authTokenStore: AuthTokenStore) {
		this.#userService = userService;
		this.#tokenStore = authTokenStore;
	}

	async login(email: string, password: string): Promise<AuthToken> {
		const user = await this.#userService.userFromLogin(email, password);
		if (user === null) {
			throw new ErrInvalidCredentials("email / pw missmatch");
		}
		if (user.disabled) {
			throw new ErrPerm(`user ${user.email} is disabled`);
		}
		const token = await newAuthToken(user.id);
		this.#tokenStore.addAuthToken(token);
		return token;
	}

	async userFromToken(raw: AuthTokenString): Promise<User | null> {
		try {
			const token = await this.#tokenStore.getAuthToken(raw);
			const user = await this.#userService.getUser(token.userID);
			return user;
		} catch (err) {
			if (err instanceof ErrNoRows || err instanceof ErrNoEnt) {
				return null;
			}
			throw err; // internal error, bubble up
		}
	}

	async logout(token: AuthTokenString) {
		this.#tokenStore.deleteAuthToken(token);
	}
}

async function newAuthToken(id: UserID): Promise<AuthToken> {
	return {
		userID: id,
		token: await genRandom(),
		createdAt: new Date(),
	};
}

const TOKEN_BYTES = 64;

async function genRandom(): Promise<string> {
	return new Promise((resolve, reject) => {
		randomBytes(TOKEN_BYTES, (err, buf) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(buf.toString("base64url"));
		});
	});
}
