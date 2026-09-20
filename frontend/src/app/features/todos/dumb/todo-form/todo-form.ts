import { Component, input, linkedSignal, output } from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface TodoEditModel {
	title: string;
	body: string;
}

@Component({
	selector: "app-todo-form",
	imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule],
	templateUrl: "./todo-form.html",
	styleUrl: "./todo-form.css",
})
export class TodoForm {
	title = input<string>("");
	body = input<string>("");

	private todoModel = linkedSignal(() => {
		return {
			title: this.title(),
			body: this.body(),
		};
	});

	todoForm = form(this.todoModel);
	submit = output<TodoEditModel>();
	cancel = output<void>();

	onSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		const todoInput = this.todoModel();
		this.submit.emit(todoInput);
	}

	onCancel(ev: PointerEvent) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		this.cancel.emit();
	}
}
