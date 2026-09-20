import { Component, inject, input, numberAttribute } from "@angular/core";
import { TodoEditModel, TodoForm } from "../dumb/todo-form/todo-form";
import { TodoID } from "../../../models/todo";
import { TodoService } from "../services/todo";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Location } from "@angular/common";

@Component({
	selector: "app-todo-edit",
	imports: [TodoForm, MatProgressSpinnerModule],
	templateUrl: "./todo-edit.html",
	styleUrl: "./todo-edit.css",
})
export class TodoEdit {
	private todoService = inject(TodoService);
	private location = inject(Location);
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
			title: data.title.trim(),
			body: data.body.trim(),
			createdAt: todo.createdAt,
		});
		this.location.back();
	}

	async onCancel() {
		this.location.back();
	}
}
