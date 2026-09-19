import { Component, input } from "@angular/core";
import { Todo } from "../../../../models/todo";
import { TodoView } from "../todo-view/todo-view";

@Component({
	selector: "app-todo-list",
	imports: [TodoView],
	templateUrl: "./todo-list.html",
	styleUrl: "./todo-list.css",
})
export class TodoList {
	todos = input.required<Todo[]>();
}
