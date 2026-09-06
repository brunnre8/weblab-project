import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { UserCreds } from "./models.ts";

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
