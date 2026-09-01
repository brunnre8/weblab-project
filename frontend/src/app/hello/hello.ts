import { Component, signal } from "@angular/core";

@Component({
	selector: "app-hello",
	imports: [],
	templateUrl: "./hello.html",
	styleUrl: "./hello.css",
})
export class Hello {
	protected readonly title = signal("playground");
}
