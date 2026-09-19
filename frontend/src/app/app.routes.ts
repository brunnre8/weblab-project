import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { TodoView } from "./features/todos/dumb/todo-view/todo-view";
import { TodoGrid } from "./features/todos/todo-grid/todo-grid";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		title: "Home",
		component: TodoView,
	},
	{
		path: "login",
		title: "login",
		component: Login,
	},
	{
		path: "list",
		title: "list",
		component: TodoGrid,
	},
];
