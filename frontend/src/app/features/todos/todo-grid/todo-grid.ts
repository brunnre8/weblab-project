import { Component, inject, effect } from "@angular/core";
import { TodoService } from "../services/todo";
import { TodoList } from "../dumb/todo-list/todo-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
	selector: "app-todo-grid",
	imports: [TodoList, MatProgressSpinnerModule],
	templateUrl: "./todo-grid.html",
	styleUrl: "./todo-grid.css",
})
export class TodoGrid {
	todoService = inject(TodoService);
	todos = this.todoService.allTodos();
	errors = effect(() => console.log(this.todos.error()));
}
