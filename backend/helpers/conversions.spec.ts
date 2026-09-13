import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { ErrBadInput, mustString, safeInt } from "./conversions.ts";

describe("safeInt", () => {
	test("good input", () => {
		expect(safeInt("34")).toBe(34);
		expect(safeInt("72")).toBe(72);
		expect(safeInt("-72")).toBe(-72);
	});

	test("bad input", () => {
		[" 42", "42.0", "42.4", "Nan", "NaN", "inf", "-inf", "42garbage"].map((x) =>
			expect(() => safeInt(x)).toThrow(ErrBadInput),
		);
	});
});

describe("mustString", () => {
	test("good input", () => {
		expect(mustString("34")).toBe("34");
		expect(mustString("")).toBe("");
	});

	test("bad input", () => {
		[null, undefined, 42, -4.7].map((x) => expect(() => mustString(x)).toThrow(ErrBadInput));
	});
});
