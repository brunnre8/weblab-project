import { httpResource } from "@angular/common/http";
import { Resource, Service } from "@angular/core";
import { parseTodoArray, Todo } from "../../../models/todo";

@Service()
export class TodoService {
	#todoResource = httpResource<Todo[]>(() => "/api/todos/", { defaultValue: [], parse: parseTodoArray });

	allTodos(): Resource<Todo[]> {
		this.#todoResource.reload();
		return this.#todoResource.asReadonly();
	}
}
