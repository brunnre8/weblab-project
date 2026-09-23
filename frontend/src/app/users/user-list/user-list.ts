import { Component, inject } from "@angular/core";
import { UserTable } from "../dumb/user-table/user-table";
import { UserService } from "../services/user";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { User } from "../../models/user";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-user-list",
	imports: [UserTable, MatProgressSpinnerModule],
	templateUrl: "./user-list.html",
	styleUrl: "./user-list.css",
})
export class UserList {
	#userService = inject(UserService);
	#snackbar = inject(MatSnackBar);

	userRes = this.#userService.allUsers();

	async onUserEdit(user: User) {
		try {
			await this.#userService.updateUser(user);
		} catch (err) {
			const msg = (err as any).message || "unknown error occured";
			this.#snackbar.open(`ERROR: ${msg}`, "Close", { politeness: "assertive" });
			return;
		}
		this.#snackbar.open(`successfully updated ${user.name}`, "Close", { duration: 5000 });
		this.userRes.reload();
	}
}
