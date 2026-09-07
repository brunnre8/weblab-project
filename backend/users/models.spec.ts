import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { UserCreds, verifyUserInput, type UserInput } from "./models.ts";
import { ErrBadInput } from "../helpers/conversions.ts";

describe("UserCreds", () => {
	test("uid is correct", async () => {
		const uid = 42;
		const creds = await UserCreds.fromPassword(uid, "asdf");
		expect(creds.userID).toEqual(uid);
	});

	test("verify ok", async () => {
		const pw = "supersecret";
		const creds = await UserCreds.fromPassword(1, pw);
		await expect(creds.validate(pw)).resolves.toBe(true);
	});

	test("verify bad", async () => {
		const creds = await UserCreds.fromPassword(2, "greatpassword!%#$@@#$--");
		await expect(creds.validate("not ok")).resolves.toBe(false);
	});
});

describe("user input validation", () => {
	test("valid", () => {
		const testCases: UserInput[] = [
			{ name: "asdf", email: "sdf@asd.com", role: "user", disabled: false },
			{ name: "asdf asdf", email: "bogus?", role: "admin", disabled: false },
			{ name: " whoops ", email: "a@a.c", role: "user", disabled: false },
			{ name: "sdf", email: "asdf@example.com", role: "admin", disabled: true },
		];
		for (const tt of testCases) {
			expect(() => verifyUserInput(tt)).not.toThrow();
		}
	});

	test("bad", () => {
		const testCases: any[] = [
			{ email: "sdf@asd.com", role: "user", disabled: false },
			{ name: "asdf asdf", email: "bogus?", role: "adminYeyey", disabled: false },
			{ name: "", email: "a@a.c", role: "user" },
			{ name: null, email: "a@a.c", role: "user" },
			{ name: "sdf", role: "admin", disabled: true },
		];
		for (const tt of testCases) {
			expect(() => verifyUserInput(tt)).toThrow(ErrBadInput);
		}
	});
});
