import { Routes } from "@angular/router";
import { TodoView } from "./todo-view/todo-view";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		title: "Home",
		component: TodoView,
	},
	// {
	// 	path: "hello",
	// 	title: "Hello",
	// 	component: Hello,
	// },
];
