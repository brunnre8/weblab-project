import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { email, form, FormField, minLength, required } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { IdendityService } from "./services/identityService";
import { User } from "../models/user";
import { MatSnackBar } from "@angular/material/snack-bar";

interface LoginData {
	email: string;
	password: string;
}

@Component({
	selector: "app-login",
	imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule],
	templateUrl: "./login.html",
	styleUrl: "./login.css",
})
export class Login {
	private loginModel = signal<LoginData>({
		email: "",
		password: "",
	});

	loginForm = form(this.loginModel, (schema) => {
		required(schema.email, { message: "email is required" });
		email(schema.email, { message: "invalid email" });
		required(schema.password, { message: "need password" });
		minLength(schema.password, 15, { message: "need >15 chars" });
	});

	private http = inject(HttpClient);
	private router = inject(Router);
	private idService = inject(IdendityService);
	private snackbar = inject(MatSnackBar);

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const credentials = this.loginModel();
		this.http
			.post("/auth/login", {
				email: credentials.email,
				password: credentials.password,
			})
			.subscribe({
				next: (user) => {
					this.idService.store(user as User);
					this.router.navigate(["/"]);
				},
				// TODO: fix error handling
				error: (err) => {
					let msg: string;
					if (err instanceof HttpErrorResponse && err.status === 401) {
						msg = "Invalid credentials";
					} else {
						msg = (err as any).message;
					}
					this.snackbar.open(`ERROR: ${msg}`, "Close", { politeness: "assertive" });
				},
			});
	}
}
