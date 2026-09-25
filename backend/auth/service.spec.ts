import { test, describe, beforeEach, afterEach, expect, vi } from "vitest";
import { SqliteStore } from "../stores/sqlite.ts";
import { UserCreds, type User } from "../users/models.ts";
import { ErrNoEnt } from "../middlewares/errors.ts";
import { AuthService, ErrInvalidCredentials } from "./service.js";
import { UserService } from "../users/service.ts";
import type { AuthTokenStore } from "./tokenStore.ts";

describe("auth service check", () => {
	let service: AuthService;
	let sqliteStore: SqliteStore;
	let tokenStore: AuthTokenStore;

	let admin: User;
	const adminPw = "admin".repeat(3);
	beforeEach(async () => {
		sqliteStore = new SqliteStore(":memory:");
		admin = {
			id: -1,
			name: "admin",
			email: "asdf@asda",
			role: "admin",
			disabled: false,
		};
		tokenStore = sqliteStore;
		const adminCreds = await UserCreds.fromPassword(adminPw);
		admin.id = await sqliteStore.insertUser(admin, adminCreds);
		service = new AuthService(new UserService(sqliteStore, sqliteStore), tokenStore);
	});

	afterEach(() => {
		sqliteStore.close();
	});

	describe("happy path", () => {
		test("login", async () => {
			const userAndToken = await service.login(admin.email, adminPw);
			expect(userAndToken.user).toStrictEqual(admin);
			await expect(service.userFromToken(userAndToken.authToken.token)).resolves.toStrictEqual(admin);
		});

		test("logout", async () => {
			const userAndToken = await service.login(admin.email, adminPw);
			expect(userAndToken.user).toStrictEqual(admin);
			await expect(service.logout(userAndToken.authToken.token)).resolves.toBeUndefined();
			await expect(service.userFromToken(userAndToken.authToken.token)).resolves.toBeNull();
		});
	});

	describe("errors", () => {
		test("login bad pw", async () => {
			await expect(service.login(admin.email, "nope")).rejects.toThrow(ErrInvalidCredentials);
		});
		test("logout bad token", async () => {
			await expect(service.logout("nope")).rejects.toThrow(ErrNoEnt);
		});
		test("expired token", async () => {
			const monthAgo = new Date();
			monthAgo.setMonth(monthAgo.getMonth() - 1);
			vi.spyOn(tokenStore, "getAuthToken").mockResolvedValue({
				userID: admin.id,
				token: "tooOld",
				createdAt: monthAgo,
			});
			await expect(service.userFromToken("tooOld")).resolves.toBeNull();
		});
	});
});
