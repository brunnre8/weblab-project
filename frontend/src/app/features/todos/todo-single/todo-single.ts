import { Component, inject, input, numberAttribute, OnInit } from "@angular/core";
import { TodoView } from "../dumb/todo-view/todo-view";
import { TodoService } from "../services/todo";
import { TodoID } from "../../../models/todo";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: "app-todo-single",
	imports: [TodoView, MatProgressSpinnerModule],
	templateUrl: "./todo-single.html",
	styleUrl: "./todo-single.css",
})
export class TodoSingle {
	private todoService = inject(TodoService);
	todoID = input.required<TodoID, string>({ transform: numberAttribute });
	todo = this.todoService.getTodo(this.todoID);
}
