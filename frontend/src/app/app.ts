import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { IdendityService } from "./login/services/identityService";
import { LogoutButton } from "./logout/logout";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink, LogoutButton],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	private idendityService = inject(IdendityService);
	idendity = this.idendityService.getSelf();
}
