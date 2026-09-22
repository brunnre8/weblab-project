import { Component, inject, input, numberAttribute, signal } from "@angular/core";
import { TodoService } from "../services/todo";
import { Todo, TodoID } from "../../models/todo";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TodoFull } from "../dumb/todo-full/todo-full";
import { Router } from "@angular/router";

@Component({
	selector: "app-todo-single",
	imports: [TodoFull, MatProgressSpinnerModule],
	templateUrl: "./todo-single.html",
	styleUrl: "./todo-single.css",
})
export class TodoSingle {
	private todoService = inject(TodoService);
	private router = inject(Router);
	todoID = input.required<TodoID, string>({ transform: numberAttribute });
	todo = this.todoService.getTodo(this.todoID);
	deleteInFlight = signal(false);

	async onDelete(todo: Todo) {
		this.deleteInFlight.set(true);
		try {
			await this.todoService.deleteTodo(todo.id);
		} catch (err) {
			this.deleteInFlight.set(false);
			throw err; // bubble to error handler
		}
		this.router.navigate(["/"]);
	}

	onEdit(todo: Todo) {
		this.router.navigate(["/todo", "edit", todo.id]);
	}
}
