import { ErrBadInput } from "../helpers/conversions.ts";
import { ErrNoRows } from "../stores/errors.ts";
import { UserCreds, type User, type UserID, type UserInput } from "./models.ts";
import { type UserStore } from "./userStore.ts";

export class UserService {
	#userStore: UserStore;

	constructor(userStore: UserStore) {
		this.#userStore = userStore;
	}

	async listUsers(): Promise<User[]> {
		return this.#userStore.listUsers();
	}

	async getUser(userID: UserID): Promise<User> {
		return this.#userStore.getUserById(userID);
	}

	async insertUser(input: UserInput, password: string): Promise<User> {
		const user: User = {
			...input,
			id: -1, // will be overwritten momentarily
		};
		// TODO: mirror in client
		if (/\s/.test(password)) {
			throw new ErrBadInput("password contains whitespace characters");
		}
		const minLength = 15;
		if (password.length < minLength) {
			throw new ErrBadInput(`password too short with ${password.length} want at least ${minLength} chars`);
		}
		const creds = await UserCreds.fromPassword(password);
		user.id = await this.#userStore.insertUser(user, creds);
		return user;
	}

	async userFromLogin(email: string, password: string): Promise<User | null> {
		try {
			const { creds, userID } = await this.#userStore.getUserCredsByEmail(email);
			if (!(await creds.validate(password))) {
				return null; // bad pw
			}
			return this.getUser(userID);
		} catch (err) {
			if (err instanceof ErrNoRows) {
				return null; // bad email
			}
			throw err;
		}
	}
}
