export type UserID = number;
export type UserRole = "user" | "admin";

export interface User {
	id: UserID;
	name: string;
	role: UserRole;
}
