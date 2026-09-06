import * as z from "zod";
import type { UserID } from "../users/models.ts";
import { ErrBadInput } from "../helpers/conversions.ts";

export type TodoID = number;

export interface Todo {
	id: TodoID;
	title: string;
	body: string;
	createdAt: Date;
	ownerID: UserID;
}

export type TodoInput = Omit<Todo, "id">;

const TodoInputSchema = z.compile(
	z.object({
		title: z.string(),
		body: z.string(),
		createdAt: z.coerce.date(),
		ownerID: z.int().nonnegative(),
	}),
);

export function verifyTodoInput(input: Partial<Todo>): TodoInput {
	const ret = TodoInputSchema.safeParse(input);
	if (!ret.success) {
		throw new ErrBadInput("bad input for todo", { cause: ret.error });
	}
	return ret.data;
}
