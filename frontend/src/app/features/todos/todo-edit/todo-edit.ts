import { Component, inject, input, numberAttribute } from "@angular/core";
import { TodoEditModel, TodoForm } from "../dumb/todo-form/todo-form";
import { Todo, TodoID } from "../../../models/todo";
import { TodoService } from "../services/todo";
import { Router } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: "app-todo-edit",
	imports: [TodoForm, MatProgressSpinnerModule],
	templateUrl: "./todo-edit.html",
	styleUrl: "./todo-edit.css",
})
export class TodoEdit {
	private todoService = inject(TodoService);
	private router = inject(Router);
	todoID = input.required<TodoID, string>({ transform: numberAttribute });
	todoRes = this.todoService.getTodo(this.todoID);

	async onSubmit(data: TodoEditModel) {
		if (!this.todoRes.hasValue) {
			// can't happen, I hope...
			return;
		}
		const todo = this.todoRes.value();
		if (!todo) {
			return;
		}
		await this.todoService.updateTodo({
			id: todo.id,
			title: data.title,
			body: data.body,
			createdAt: todo.createdAt,
		});
		await this.router.navigate(["/todo", todo.id]);
	}

	async onCancel() {
		this.router.navigate(["/todo", this.todoID()]);
	}
}
