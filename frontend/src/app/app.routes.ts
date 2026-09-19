import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { TodoList } from "./features/todos/dumb/todo-list/todo-list";
import { Todo } from "./models/todo";
import { TodoView } from "./features/todos/dumb/todo-view/todo-view";

const dummyTodos: Todo[] = [
	{
		id: 1,
		title: "title A",
		body: "body A",
		createdAt: new Date(),
	},
	{
		id: 2,
		title: "title B",
		body: "body B",
		createdAt: new Date(),
	},
];

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
		component: TodoList,
		data: {
			todos: dummyTodos,
		},
	},
];
