import { Component, computed, input } from "@angular/core";
import { Todo, dummyTodo } from "../../models/todo";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-todo-view",
	imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
	templateUrl: "./todo-view.html",
	styleUrl: "./todo-view.css",
})
export class TodoView {
	todo = input(dummyTodo);
	max_lines = input<number>();
	max_lines_var = computed(() => this.max_lines() ?? "Undefined");

	renderTodoTime(todo: Todo) {
		return todo.createdAt.withTimeZone(Temporal.Now.timeZoneId()).toLocaleString(navigator.language, {
			dateStyle: "short",
			timeStyle: "short",
		});
	}

	onEdit(ev: PointerEvent) {
		ev.preventDefault();
		console.log(ev);
	}
}
