import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { TodoGrid } from "./features/todos/todo-grid/todo-grid";
import { TodoSingle } from "./features/todos/todo-single/todo-single";
import { TodoEdit } from "./features/todos/todo-edit/todo-edit";
import { TodoNew } from "./features/todos/todo-new/todo-new";

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
	{
		path: "todo/new",
		title: "new todo",
		component: TodoNew,
	},
	{
		path: "todo/edit/:todoID",
		title: "edit todo",
		component: TodoEdit,
	},
	{
		path: "todo/:todoID",
		title: "todo",
		component: TodoSingle,
	},
];
