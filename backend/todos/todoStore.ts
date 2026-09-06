import type { UserID } from "../users/models.ts";
import type { TodoID, Todo } from "./models.ts";

export interface TodoStore {
	// get Todo from the store
	getTodo(id: TodoID): Promise<Todo>;

	// List all todos in the store with the given owner
	listTodos(ownerID: UserID): Promise<Todo[]>;

	// insert Todo to the store, returning primary key
	insertTodo(todo: Omit<Todo, "id">): Promise<TodoID>;

	// update Todo based on its primary key
	updateTodo(todo: Todo): Promise<void>;
}
