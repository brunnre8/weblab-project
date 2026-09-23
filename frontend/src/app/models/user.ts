import * as z from "zod";

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

const UserInputSchema = z.compile(
	z.object({
		id: z.number(),
		name: z.string(),
		email: z.string(),
		role: z.enum(userRoles),
		disabled: z.boolean(),
	}),
);

const UserInputArraySchema = z.compile(z.array(UserInputSchema));

export function parseUserArray(raw: unknown): User[] {
	return UserInputArraySchema.parse(raw);
}

export function parseUser(raw: unknown): User {
	return UserInputSchema.parse(raw);
}
