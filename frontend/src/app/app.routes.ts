import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { TodoGrid } from "./features/todos/todo-grid/todo-grid";

export const routes: Routes = [
	{
		path: "login",
		title: "login",
		component: Login,
	},
	{
		path: "",
		title: "Home",
		component: TodoGrid,
	},
];
