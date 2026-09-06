import { test, describe, beforeEach, expect } from "vitest";
import { SqliteStore } from "./sqlite.ts";
import { ErrNoRows } from "./errors.ts";
import { type User } from "../users/models.ts";
import { type UserStore } from "../users/userStore.ts";

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
			// we want the userid to be ignored for inserts
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
			const userA = dummyUser({ name: "billy" });
			const userB = dummyUser({ name: "marry" });
			const userList = [userA, userB];
			[userA.id, userB.id] = await Promise.all(userList.map((u) => db.insertUser(u)));
			const dbList = await db.listUsers();
			expect(dbList).toHaveLength(2);
			expect(dbList).toStrictEqual(userList);
		});
	});

	describe("validity", () => {
		test("duplicate email disallowed", async () => {
			const userA = dummyUser({ name: "billy", email: "one@example.com" });
			const userB = dummyUser({ name: "marry", email: "one@example.com" });
			await db.insertUser(userA);
			await expect(db.insertUser(userB)).rejects.toThrow(/email/);
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
		// email has a unique constraint, so ensure we don't collide by default
		...(props?.name ? { email: props.name + "@example.com" } : {}),
		...props,
	};
}
