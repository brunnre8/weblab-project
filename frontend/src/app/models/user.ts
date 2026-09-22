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
