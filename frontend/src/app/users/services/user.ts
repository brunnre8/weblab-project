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

	async addUser(user: Omit<User, "id">, password: string): Promise<void> {
		return firstValueFrom(
			this.#http
				.post(
					"/api/users/new",
					{
						user,
						password,
					},
					{ responseType: "text" },
				)
				.pipe(map(() => undefined)),
		);
	}

	// async deleteTodo(id: TodoID): Promise<void> {
	// 	return firstValueFrom(this.#http.delete(`/api/todos/${id}`, { responseType: "text" }).pipe(map(() => undefined)));
	// }
}
