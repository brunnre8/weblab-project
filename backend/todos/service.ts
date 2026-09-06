import { ErrNoRows } from "../stores/errors.ts";
import type { User, UserID } from "../users/models.ts";
import { ErrNoEnt, ErrPerm } from "../middlewares/errors.ts";
import type { Todo, TodoID, TodoInput } from "./models.ts";
import type { TodoStore } from "./todoStore.ts";

export class TodoService {
	#todoStore: TodoStore;

	constructor(todoStore: TodoStore) {
		this.#todoStore = todoStore;
	}

	async listTodos(ownerID: UserID): Promise<Todo[]> {
		return this.#todoStore.listTodos(ownerID);
	}

	async insertTodo(input: TodoInput, requestor: User): Promise<Todo> {
		const todo: Todo = {
			...input,
			ownerID: requestor.id,
			id: -1, // will be overwritten momentarily
		};
		todo.id = await this.#todoStore.insertTodo(todo);
		return todo;
	}

	async updateTodo(updateId: TodoID, updates: TodoInput, requestor: User): Promise<void> {
		const original = await this.#todoStore.getTodo(updateId);
		if (!canWrite(original, requestor)) {
			throw new ErrPerm(`requestor: ${requestor.id} tried to write todo owned by ${original.ownerID}`);
		}
		const newtodo: Todo = {
			...original,
			...updates,
			// A user mustn't update the owner nor be able to change the TodoID
			id: original.id,
			ownerID: original.ownerID,
		};
		return this.#todoStore.updateTodo(newtodo);
	}

	async deleteTodo(todoID: TodoID, requestor: User): Promise<void> {
		const target = await this.#todoStore.getTodo(todoID);
		if (!canWrite(target, requestor)) {
			throw new ErrPerm(`requestor: ${requestor.id} tried to delete todo owned by ${target.ownerID}`);
		}
		return this.#todoStore.deleteTodo(todoID);
	}

	async getTodo(todoID: TodoID, requestor: User): Promise<Todo> {
		let todo: Todo;
		try {
			todo = await this.#todoStore.getTodo(todoID);
		} catch (err) {
			if (err instanceof ErrNoRows) {
				throw new ErrNoEnt("todo doesn't exist", { cause: err });
			}
			throw err;
		}
		if (!canRead(todo, requestor)) {
			throw new ErrPerm(`requestor: ${requestor.id} tried to access todo owned by ${todo.ownerID}`);
		}
		return todo;
	}
}

function canRead(todo: Todo, requestor: User): boolean {
	return requestor.role === "admin" || requestor.id === todo.ownerID;
}

function canWrite(todo: Todo, requestor: User) {
	return requestor.id === todo.ownerID;
}
