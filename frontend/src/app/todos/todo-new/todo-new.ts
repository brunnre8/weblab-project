import { Component, inject } from "@angular/core";
import { TodoEditModel, TodoForm } from "../dumb/todo-form/todo-form";
import { TodoService } from "../services/todo";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Location } from "@angular/common";

@Component({
	selector: "app-todo-new",
	imports: [TodoForm, MatProgressSpinnerModule],
	templateUrl: "./todo-new.html",
	styleUrl: "./todo-new.css",
})
export class TodoNew {
	private todoService = inject(TodoService);
	private location = inject(Location);

	async onSubmit(data: TodoEditModel) {
		await this.todoService.addTodo({
			title: data.title.trim(),
			body: data.body.trim(),
		});
		this.location.back();
	}

	async onCancel() {
		this.location.back();
	}
}
