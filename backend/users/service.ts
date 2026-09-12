import { ErrBadInput } from "../helpers/conversions.ts";
import { ErrConflict, ErrPerm } from "../middlewares/errors.ts";
import { ErrConstraint, ErrNoRows } from "../stores/errors.ts";
import { UserCreds, verifyUserInput, type User, type UserID, type UserInput } from "./models.ts";
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
		const sanitized = verifyUserInput(input);
		verifyPasswordRequirements(password);
		const user: User = {
			...sanitized,
			id: -1, // will be overwritten momentarily
		};
		const creds = await UserCreds.fromPassword(password);
		try {
			user.id = await this.#userStore.insertUser(user, creds);
			return user;
		} catch (err) {
			if (err instanceof ErrConstraint) {
				throw new ErrConflict("conflicting user", { cause: err });
			}
			throw err;
		}
	}

	async updateUser(updateId: UserID, updates: UserInput): Promise<void> {
		const original = await this.#userStore.getUserById(updateId);
		const patches = verifyUserInput(updates);
		const updated: User = {
			...original,
			...patches,
			// this should be a no-op, but make sure this is never overwritten
			id: original.id,
		};
		try {
			await this.#userStore.updateUser(updated);
		} catch (err) {
			if (err instanceof ErrConstraint) {
				throw new ErrConflict("conflicting user", { cause: err });
			}
			throw err;
		}
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
function verifyPasswordRequirements(password: string) {
	// TODO: mirror in client
	if (/\s/.test(password)) {
		throw new ErrBadInput("password contains whitespace characters");
	}
	const minLength = 15;
	if (password.length < minLength) {
		throw new ErrBadInput(`password too short with ${password.length} want at least ${minLength} chars`);
	}
}
