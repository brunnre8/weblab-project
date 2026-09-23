import { HttpClient, httpResource, HttpResourceRef } from "@angular/common/http";
import { EnvironmentInjector, inject, Service } from "@angular/core";
import { parseUserArray, User } from "../../models/user";
import { firstValueFrom, map } from "rxjs";

@Service()
export class UserService {
	#http = inject(HttpClient);
	#injector = inject(EnvironmentInjector);

	allUsers(): HttpResourceRef<User[]> {
		return httpResource<User[]>(() => "/api/users/", {
			defaultValue: [],
			parse: parseUserArray,
			injector: this.#injector,
		});
	}

	updateUser(user: User): Promise<void> {
		return firstValueFrom(
			this.#http.put(`/api/users/${user.id}`, user, { responseType: "text" }).pipe(map(() => undefined)),
		);
	}

	// getTodo(id: Signal<TodoID>): Resource<Todo | undefined> {
	// 	return httpResource<Todo>(() => `/api/todos/${id()}`, { parse: parseTodo, injector: this.#injector }).asReadonly();
	// }
	//
	// async deleteTodo(id: TodoID): Promise<void> {
	// 	return firstValueFrom(this.#http.delete(`/api/todos/${id}`, { responseType: "text" }).pipe(map(() => undefined)));
	// }
	//
	// async updateTodo(todo: TodoUpdate): Promise<void> {
	// 	return firstValueFrom(
	// 		this.#http.put(`/api/todos/${todo.id}`, todo, { responseType: "text" }).pipe(map(() => undefined)),
	// 	);
	// }
	//
	// async addTodo(todo: TodoInsert): Promise<void> {
	// 	return firstValueFrom(
	// 		this.#http
	// 			.post(
	// 				"/api/todos/new",
	// 				{
	// 					title: todo.title,
	// 					body: todo.body,
	// 				},
	// 				{ responseType: "text" },
	// 			)
	// 			.pipe(map(() => undefined)),
	// 	);
	// }
}
