import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { SqliteStore } from "../stores/sqlite.ts";
import { UserService } from "./service.ts";
import { dummyTodo, dummyUser } from "../stores/sqlite.spec.ts";
import { UserCreds, type User, type UserID } from "../users/models.ts";
import { ErrNoEnt, ErrPerm } from "../middlewares/errors.ts";

describe("todo service check", () => {
	let service: UserService;
	let sqliteStore: SqliteStore;

	let admin: User;
	let billy: User;
	let maria: User;

	beforeEach(async () => {
		sqliteStore = new SqliteStore(":memory:");
		[admin, billy, maria] = await populateDummy(sqliteStore);
		service = new UserService(sqliteStore);
	});

	afterEach(() => {
		sqliteStore.close();
	});

	describe("happy path", () => {
		test("list", async () => {
			const dbUsers = await service.listUsers();
			dbUsers.sort((a, b) => a.id - b.id);
			expect(dbUsers).toEqual([admin, billy, maria]);
		});

		test("getUser", async () => {
			await expect(service.getUser(maria.id)).resolves.toStrictEqual(maria);
		});

		test("insertUser", async () => {
			const user = dummyUser({ name: "someone", role: "user" });
			delete (user as any)["id"]; // dummy
			const pw = "ddkdeiufkfhasd;foiwdk#@!";
			const newUser = await service.insertUser(user, pw);
			expect(newUser).toMatchObject(user);
			await expect(service.getUser(newUser.id)).resolves.toStrictEqual(newUser);
		});

		test("userFromLogin", async () => {
			const user = dummyUser({ name: "someone", role: "user" });
			const pw = "ddkdeiufkfhasd;foiwdk#@!";
			const creds = await UserCreds.fromPassword(pw);
			user.id = await sqliteStore.insertUser(user, creds);
			await expect(service.userFromLogin(user.email, pw)).resolves.toStrictEqual(user);
			await expect(service.userFromLogin(user.email, "incorrect")).resolves.toBeNull();
			await expect(service.userFromLogin("404@example.com", pw)).resolves.toBeNull();
		});
	});
});

async function populateDummy(db: SqliteStore): Promise<[User, User, User]> {
	const admin = dummyUser({ name: "admin", role: "admin" });
	admin.id = await db.insertUser(admin);
	const billy = dummyUser({ name: "billy" });
	billy.id = await db.insertUser(billy);
	const maria = dummyUser({ name: "maria" });
	maria.id = await db.insertUser(maria);
	return [admin, billy, maria];
}
