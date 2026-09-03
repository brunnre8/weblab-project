import { describe, beforeEach, it, expect } from "vitest";

describe("App", () => {
	beforeEach(async () => {
		console.log("before each");
	});

	it("should work", () => {
		expect(42).toBeTruthy();
	});
});
