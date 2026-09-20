import * as z from "zod";
export type TodoID = number;

export interface Todo {
	id: TodoID;
	title: string;
	body: string;
	createdAt: Date;
	// TODO: owner
	ownerID: number;
}

const TodoInputSchema = z.compile(
	z.object({
		id: z.number(),
		title: z.string(),
		body: z.string(),
		createdAt: z.coerce.date(),
		ownerID: z.int().nonnegative(),
	}),
);

const TodoInputArraySchema = z.compile(z.array(TodoInputSchema));

export function parseTodoArray(raw: unknown): Todo[] {
	return TodoInputArraySchema.parse(raw);
}

export function parseTodo(raw: unknown): Todo {
	return TodoInputSchema.parse(raw);
}
