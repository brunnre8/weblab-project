import { test, describe, beforeEach, expect } from "vitest";
import { SqliteStore } from "./sqlite.ts";
import { ErrNoRows } from "./errors.ts";
import { User } from "../users/models.ts";
import { UserStore } from "../users/userStore.ts";

describe("sqlite", () => {
	let db: UserStore;

	beforeEach(() => {
		db = new SqliteStore(":memory:");
	});

	describe("404s", () => {
		test("getUserById", async () => {
			console.log(dummyUser());
			await expect(db.getUserById(-1)).rejects.toThrow(ErrNoRows);
		});

		test("updateUser", async () => {
			await expect(db.updateUser(dummyUser())).rejects.toThrow(ErrNoRows);
		});

		test("listUsers", async () => {
			await expect(db.listUsers()).resolves.toHaveLength(0);
		});
	});

	describe("roundtrips", () => {
		test("getUserById", async () => {
			const user = dummyUser({ role: "admin" });
			user.id = await db.insertUser(user);
			expect(user.id).not.toBe(-1);
			const dbUser = await db.getUserById(user.id);
			expect(dbUser).toStrictEqual(user);
		});

		test("updateUser", async () => {
			const user = dummyUser({ role: "admin" });
			user.id = await db.insertUser(user);
			user.role = "user";
			expect(db.updateUser(user)).resolves;
			const dbUser = await db.getUserById(user.id);
			expect(dbUser).toStrictEqual(user);
		});

		test("listUsers", async () => {
			await expect(db.listUsers()).resolves.toHaveLength(0);
		});
	});
});

function dummyUser(props?: Partial<User>): User {
	return {
		id: -1,
		name: "dummy",
		email: "dummy@example.com",
		role: "user",
		disabled: false,
		...props,
	};
}
