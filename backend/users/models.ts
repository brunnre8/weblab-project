import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import * as z from "zod";
import { ErrBadInput } from "../helpers/conversions.ts";

export type UserID = number;
export const userRoles = ["user", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export interface User {
	id: UserID;
	name: string;
	email: string;
	role: UserRole;
	disabled: boolean;
}

export type UserInput = Omit<User, "id">;

const UserInputSchema = z.compile(
	z.object({
		name: z.string().trim().nonempty(),
		email: z.string(), // could do email type, but that's regex based and ill advised
		role: z.enum(userRoles),
		disabled: z.boolean(),
	}),
);

export function verifyUserInput(input: Partial<User>): UserInput {
	const ret = UserInputSchema.safeParse(input);
	if (!ret.success) {
		throw new ErrBadInput("bad input for todo", { cause: ret.error });
	}
	return ret.data;
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

	static async fromPassword(userID: UserID, password: string): Promise<UserCreds> {
		const salt = await genSalt();
		const hash = await hashPassword(password, salt);
		return new UserCreds(userID, hash, salt);
	}

	async validate(password: string): Promise<boolean> {
		const otherPw = normalizePw(password);
		const otherHash = await hashPassword(otherPw, this.#salt);
		return timingSafeEqual(this.#pwHash, otherHash);
	}

	get userID(): UserID {
		return this.#userID;
	}
}

const SALT_BYTES = 16;
const SCRYPT_KEYLEN = 64;

async function genSalt(): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		randomBytes(SALT_BYTES, (err, buf) => {
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
		scrypt(normalizedPw, salt, SCRYPT_KEYLEN, (err, hash) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(hash);
		});
	});
}
