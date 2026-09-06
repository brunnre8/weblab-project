import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { ErrBadInput, safeInt } from "./conversions.ts";

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
