import type { UserID } from "../users/models.ts";

export type TodoID = number;

export interface Todo {
	id: TodoID;
	title: string;
	body: string;
	createdAt: Date;
	ownerID: UserID;
}
