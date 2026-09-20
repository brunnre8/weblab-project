import { Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from "@angular/common";
import { Todo } from "../../../../models/todo";

@Component({
	selector: "app-todo-full",
	imports: [MatCardModule, MatIconModule, MatButtonModule, DatePipe],
	templateUrl: "./todo-full.html",
	styleUrl: "./todo-full.css",
})
export class TodoFull {
	todo = input.required<Todo>();
	onEdit = output<Todo>();
	onDelete = output<Todo>();
	canDelete = input(true);
}
