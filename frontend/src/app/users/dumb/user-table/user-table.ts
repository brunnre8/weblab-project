import { Component, computed, inject, input, output } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { User } from "../../../models/user";
import { MatDialog } from "@angular/material/dialog";
import { EditDialogReply, UserTableEditDialog } from "../user-table-edit-dialog/user-table-edit-dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-user-table",
	imports: [MatTableModule, MatButtonModule, MatIconModule],
	templateUrl: "./user-table.html",
	styleUrl: "./user-table.css",
})
export class UserTable {
	readonly editDialog = inject(MatDialog);

	users = input.required<User[]>();

	displayedCols = ["name", "email", "role", "disabled"];

	sortedUsers = computed(() => {
		return this.users().toSorted((a, b) => a.name.localeCompare(b.name));
	});

	change = output<User>();
	delete = output<User>();

	onClick(user: User) {
		const dialogRef = this.editDialog.open<UserTableEditDialog, User, EditDialogReply>(UserTableEditDialog, {
			data: user,
		});
		dialogRef.afterClosed().subscribe((reply: EditDialogReply | undefined) => {
			if (!reply) {
				return;
			}
			switch (reply.type) {
				case "edit": {
					this.change.emit(reply.user);
					return;
				}
				case "delete": {
					this.delete.emit(reply.user);
				}
			}
		});
	}
}
