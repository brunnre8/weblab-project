import { Service, Signal } from "@angular/core";
import { signal } from "@angular/core";
import { User } from "../../models/user";

const LOCALSTORAGE_KEY = "idendity";

@Service()
export class IdendityService {
	#self = signal<User | null>(null);

	constructor() {
		const raw = localStorage.getItem(LOCALSTORAGE_KEY);
		if (!raw) {
			return;
		}
		const user = JSON.parse(raw);
		this.#self.set(user);
	}

	store(user: User) {
		this.#self.set(user);
		localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user));
	}

	clear() {
		this.#self.set(null);
		localStorage.removeItem(LOCALSTORAGE_KEY);
	}

	getSelf(): Signal<User | null> {
		return this.#self.asReadonly();
	}
}
