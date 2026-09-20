import { HttpClient, httpResource } from "@angular/common/http";
import { inject, resource, Resource, Service, Signal } from "@angular/core";
import { parseTodoArray, Todo, TodoID } from "../../../models/todo";
import { firstValueFrom, map } from "rxjs";

@Service()
export class TodoService {
	#todoResource = httpResource<Todo[]>(() => "/api/todos/", { defaultValue: [], parse: parseTodoArray });
	#http = inject(HttpClient);

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

	async deleteTodo(id: TodoID): Promise<void> {
		return firstValueFrom(this.#http.delete(`/api/todos/${id}`, { responseType: "text" }).pipe(map(() => undefined)));
	}
}
