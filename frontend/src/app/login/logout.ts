import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { IdendityService } from "../login/services/identityService";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-logout-btn",
	imports: [MatButtonModule],
	templateUrl: "./logout.html",
	styleUrl: "./logout.css",
})
export class LogoutButton {
	private http = inject(HttpClient);
	private idService = inject(IdendityService);
	private router = inject(Router);

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		this.idService.clear();
		this.http.post("/auth/logout", undefined, { responseType: "text" }).subscribe({
			next: async () => {
				console.log("next triggered");
				await this.router.navigate(["/login"]);
			},
			// TODO: fix error handling
			error: (err) => {
				console.log("error from logout");
				console.log(err);
			},
		});
	}
}
