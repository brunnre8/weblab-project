import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { User, userRoles } from "../../../models/user";
import { MatInputModule } from "@angular/material/input";
import { email, form, FormField, minLength, required, validate } from "@angular/forms/signals";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";

export type UserNewData = Omit<User, "id"> & {
	password: string;
	repeatPassword: string;
};

@Component({
	selector: "app-user-table-new-dialog",
	imports: [
		MatDialogModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		FormField,
	],
	templateUrl: "./user-table-new-dialog.html",
	styleUrl: "./user-table-new-dialog.css",
})
export class UserTableNewDialog {
	dialog = inject<MatDialogRef<this, UserNewData>>(MatDialogRef);
	userModel = signal<UserNewData>({
		name: "",
		email: "",
		role: "user",
		disabled: false,
		password: "",
		repeatPassword: "",
	});
	userForm = form(this.userModel, (schema) => {
		required(schema.name, { message: "name is required" });
		required(schema.email, { message: "email is required" });
		email(schema.email, { message: "need an email address" });
		required(schema.password, { message: "need a password" });
		minLength(schema.password, 15, { message: "need at least 15 chars" });
		validate(schema.password, ({ value }) => {
			if (/\s/.test(value())) {
				return {
					kind: "whiteSpaceInPassword",
					message: "Passwords contains whitespace",
				};
			}
			return null;
		});
		validate(schema.password, ({ value, valueOf }) => {
			const pw = value();
			const repeat = valueOf(schema.repeatPassword);
			if (repeat !== pw) {
				return {
					kind: "passwordMissmatch",
					message: "Passwords don't match",
				};
			}
			return null;
		});
	});
	userRoles = userRoles;

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		this.dialog.close(this.userModel());
	}
}
