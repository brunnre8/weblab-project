import { Routes } from "@angular/router";
import { TodoView } from "./todo-view/todo-view";
import { Login } from "./login/login";

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
];
