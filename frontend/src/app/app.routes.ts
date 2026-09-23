import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { TodoGrid } from "./todos/todo-grid/todo-grid";
import { TodoNew } from "./todos/todo-new/todo-new";
import { TodoEdit } from "./todos/todo-edit/todo-edit";
import { TodoSingle } from "./todos/todo-single/todo-single";
import { UserTable } from "./users/dumb/user-table/user-table";

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
	{
		path: "users",
		title: "user list",
		component: UserTable,
	},
];
