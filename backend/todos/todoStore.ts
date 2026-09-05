import { type TodoID, type Todo } from "./models.ts";

export interface TodoStore {
	// get Todo from the store
	getTodo(id: TodoID): Promise<Todo>;

	// List all todos in the store
	listTodos(): Promise<Todo[]>;

	// insert Todo to the store, returning primary key
	insertTodo(todo: Todo): Promise<TodoID>;

	// update Todo based on its primary key
	updateTodo(todo: Todo): Promise<void>;
}
