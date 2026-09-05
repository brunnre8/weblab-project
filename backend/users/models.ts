import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

export type UserID = number;
export type UserRole = "user" | "admin";

export interface User {
	id: UserID;
	name: string;
	email: string;
	role: UserRole;
	disabled: boolean;
}

export class UserCreds {
	#userID: UserID;
	#pwHash: Buffer;
	#salt: Buffer;

	constructor(userID: UserID, pwHash: Buffer, salt: Buffer) {
		this.#userID = userID;
		this.#pwHash = pwHash;
		this.#salt = salt;
	}

	static async FromPassword(userID: UserID, password: string): Promise<UserCreds> {
		const salt = await genSalt();
		const hash = await hashPassword(password, salt);
		return new UserCreds(userID, hash, salt);
	}

	async validate(password: string): Promise<boolean> {
		const otherPw = normalizePw(password);
		const otherHash = await hashPassword(otherPw, this.#salt);
		return timingSafeEqual(this.#pwHash, otherHash);
	}
}

async function genSalt(): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		randomBytes(16, (err, buf) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(buf);
		});
	});
}

function normalizePw(pw: string): string {
	// https://nodejs.org/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis
	return pw.normalize();
}

async function hashPassword(pw: string, salt: Buffer): Promise<Buffer> {
	const normalizedPw = normalizePw(pw);
	return new Promise((resolve, reject) => {
		scrypt(normalizedPw, salt, 64, (err, hash) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(hash);
		});
	});
}
