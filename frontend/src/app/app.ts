import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {}
