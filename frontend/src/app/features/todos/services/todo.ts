import { httpResource } from "@angular/common/http";
import { resource, Resource, Service, Signal } from "@angular/core";
import { parseTodoArray, Todo, TodoID } from "../../../models/todo";

@Service()
export class TodoService {
	#todoResource = httpResource<Todo[]>(() => "/api/todos/", { defaultValue: [], parse: parseTodoArray });

	allTodos(): Resource<Todo[]> {
		this.#todoResource.reload();
		return this.#todoResource.asReadonly();
	}

	getTodo(id: Signal<TodoID>): Resource<Todo | undefined> {
		return resource({
			params: ({ chain }) => {
				const todos = chain(this.#todoResource);
				return { id: id(), todos: todos };
			},
			loader: async ({ params }) => params.todos.find((t) => t.id === params.id),
		});
	}
}
