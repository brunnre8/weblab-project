import { Component, inject } from "@angular/core";
import { UserTable } from "../dumb/user-table/user-table";
import { UserService } from "../services/user";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { User } from "../../models/user";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { UserNewData, UserTableNewDialog } from "../dumb/user-table-new-dialog/user-table-new-dialog";

@Component({
	selector: "app-user-list",
	imports: [UserTable, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
	templateUrl: "./user-list.html",
	styleUrl: "./user-list.css",
})
export class UserList {
	#userService = inject(UserService);
	#snackbar = inject(MatSnackBar);
	#newDialog = inject(MatDialog);

	userRes = this.#userService.allUsers();

	async onUserEdit(user: User) {
		try {
			if (!this.userRes.hasValue()) {
				console.log("userRes empty, shouldn't happen");
				return;
			}
			verifyHasAdminLeft(this.userRes.value(), user);
			await this.#userService.updateUser(user);
		} catch (err) {
			const msg = (err as any).message || "unknown error occured";
			this.#snackbar.open(`ERROR: ${msg}`, "Close", { politeness: "assertive" });
			return;
		}
		this.#snackbar.open(`successfully updated ${user.name}`, "Close", { duration: 5000 });
		this.userRes.reload();
	}

	async onUserDelete(user: User) {
		try {
			if (!this.userRes.hasValue()) {
				console.log("userRes empty, shouldn't happen");
				return;
			}
			verifyHasAdminLeft(this.userRes.value(), user);
			await this.#userService.deleteUser(user.id);
		} catch (err) {
			const msg = (err as any).message || "unknown error occured";
			this.#snackbar.open(`ERROR: ${msg}`, "Close", { politeness: "assertive" });
			return;
		}
		this.#snackbar.open(`successfully deleted ${user.name}`, "Close", { duration: 5000 });
		this.userRes.reload();
	}

	onNewBtn() {
		const dialogRef = this.#newDialog.open<UserTableNewDialog, undefined, UserNewData>(UserTableNewDialog);
		dialogRef.afterClosed().subscribe(async (data: UserNewData | undefined) => {
			if (!data) {
				return;
			}
			await this.handleNewUser(data);
		});
	}

	async handleNewUser(data: UserNewData) {
		try {
			await this.#userService.addUser(
				{
					name: data.name,
					email: data.email,
					role: data.role,
					disabled: data.disabled,
				},
				data.password,
			);
		} catch (err) {
			const msg = (err as any).message || "unknown error occured";
			this.#snackbar.open(`ERROR: ${msg}`, "Close", { politeness: "assertive" });
			return;
		}
		this.#snackbar.open(`successfully created ${data.name}`, "Close", { duration: 5000 });
		this.userRes.reload();
	}
}

function verifyHasAdminLeft(users: User[], user: User) {
	const original = users.find((u) => u.id === user.id);
	if (!original) {
		throw new Error("bogus user input from dialog");
	}
	if (original.role === "admin") {
		if (!users.filter((a) => a.id !== user.id).find((u) => u.role === "admin")) {
			throw new Error("change would remove last admin, can't do that");
		}
	}
}
