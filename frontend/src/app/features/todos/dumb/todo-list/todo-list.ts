import { Component, input } from "@angular/core";
import { Todo } from "../../../../models/todo";
import { TodoView } from "../todo-view/todo-view";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-todo-list",
	imports: [TodoView, MatButtonModule, MatIconModule, RouterLink],
	templateUrl: "./todo-list.html",
	styleUrl: "./todo-list.css",
})
export class TodoList {
	todos = input.required<Todo[]>();
}
