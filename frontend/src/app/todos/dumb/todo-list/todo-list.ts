import { Component, input } from "@angular/core";
import { TodoView } from "../todo-view/todo-view";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { Todo } from "../../../models/todo";

@Component({
	selector: "app-todo-list",
	imports: [TodoView, MatButtonModule, MatIconModule, RouterLink],
	templateUrl: "./todo-list.html",
	styleUrl: "./todo-list.css",
})
export class TodoList {
	todos = input.required<Todo[]>();
}
