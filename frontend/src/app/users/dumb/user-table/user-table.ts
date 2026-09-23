import { Component, computed, signal } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { User } from "../../../models/user";

@Component({
	selector: "app-user-table",
	imports: [MatTableModule],
	templateUrl: "./user-table.html",
	styleUrl: "./user-table.css",
})
export class UserTable {
	private users = signal<User[]>([
		{ id: 1, name: "admin", email: "admin@localhost", disabled: false, role: "admin" },
		{ id: 2, name: "billy", email: "billy@localhost", disabled: false, role: "user" },
		{ id: 3, name: "eva", email: "eva@localhost", disabled: true, role: "user" },
	]);

	displayedCols = ["id", "name", "email", "role", "disabled"];

	sortedUsers = computed(() => {
		return this.users().toSorted((a, b) => {
			return a.id - b.id;
		});
	});
}
