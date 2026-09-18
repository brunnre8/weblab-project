import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";

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

	loginForm = form(this.loginModel);

	private http = inject(HttpClient);
	private router = inject(Router);

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const credentials = this.loginModel();
		this.http
			.post(
				"/auth/login",
				{
					email: credentials.email,
					password: credentials.password,
				},
				{ responseType: "text" },
			)
			.subscribe({
				next: () => {
					console.log("asdf");
					this.router.navigate(["/"]);
				},
				// TODO: fix error handling
				error: (err) => console.log(err),
			});
	}
}
