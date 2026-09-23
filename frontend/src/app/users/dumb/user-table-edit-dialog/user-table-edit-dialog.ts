import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { User, userRoles } from "../../../models/user";
import { MatInputModule } from "@angular/material/input";
import { email, form, FormField, required } from "@angular/forms/signals";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
	selector: "app-user-table-edit-dialog",
	imports: [
		MatDialogModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		FormField,
	],
	templateUrl: "./user-table-edit-dialog.html",
	styleUrl: "./user-table-edit-dialog.css",
})
export class UserTableEditDialog {
	user = inject<User>(MAT_DIALOG_DATA);
	dialog = inject<MatDialogRef<this, User>>(MatDialogRef);
	userModel = signal(this.user);
	userForm = form(this.userModel, (schema) => {
		required(schema.name, { message: "name is required" });
		required(schema.email, { message: "email is required" });
		email(schema.email, { message: "need an email address" });
	});
	userRoles = userRoles;

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		this.dialog.close({
			...this.user,
			...this.userModel(),
		});
	}
}
