import { Component, computed, inject, input, output } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { User } from "../../../models/user";
import { MatDialog } from "@angular/material/dialog";
import { UserTableEditDialog } from "../user-table-edit-dialog/user-table-edit-dialog";

@Component({
	selector: "app-user-table",
	imports: [MatTableModule],
	templateUrl: "./user-table.html",
	styleUrl: "./user-table.css",
})
export class UserTable {
	readonly editDialog = inject(MatDialog);

	users = input.required<User[]>();

	displayedCols = ["id", "name", "email", "role", "disabled"];

	sortedUsers = computed(() => {
		return this.users().toSorted((a, b) => {
			return a.id - b.id;
		});
	});

	change = output<User>();

	onClick(user: User) {
		const dialogRef = this.editDialog.open<UserTableEditDialog, User, User>(UserTableEditDialog, {
			data: user,
		});
		dialogRef.afterClosed().subscribe((user: User | undefined) => {
			if (!user) {
				return;
			}
			this.change.emit(user);
		});
	}
}
