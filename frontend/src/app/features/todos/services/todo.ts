import { HttpClient, httpResource } from "@angular/common/http";
import { EnvironmentInjector, inject, Resource, Service, Signal } from "@angular/core";
import { parseTodo, parseTodoArray, Todo, TodoID } from "../../../models/todo";
import { firstValueFrom, map } from "rxjs";

@Service()
export class TodoService {
	#http = inject(HttpClient);
	#injector = inject(EnvironmentInjector);

	allTodos(): Resource<Todo[]> {
		return httpResource<Todo[]>(() => "/api/todos/", {
			defaultValue: [],
			parse: parseTodoArray,
			injector: this.#injector,
		}).asReadonly();
	}

	getTodo(id: Signal<TodoID>): Resource<Todo | undefined> {
		return httpResource<Todo>(() => `/api/todos/${id()}`, { parse: parseTodo, injector: this.#injector }).asReadonly();
	}

	async deleteTodo(id: TodoID): Promise<void> {
		return firstValueFrom(this.#http.delete(`/api/todos/${id}`, { responseType: "text" }).pipe(map(() => undefined)));
	}
}
