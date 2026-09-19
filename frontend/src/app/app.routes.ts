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
	{
		id: 3,
		title: "title B",
		body: "body B",
		createdAt: new Date(),
	},
	{
		id: 4,
		title: "title B",
		body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a condimentum justo. Sed egestas tempor dapibus. Curabitur sit amet varius tortor. Phasellus ultricies purus in hendrerit venenatis. Vivamus ultricies sagittis nibh, sit amet luctus metus dapibus nec. Vivamus nec malesuada elit, eu egestas urna. Nullam mauris felis, vulputate ut augue eu, pretium laoreet nisl. Vestibulum non arcu a ipsum mattis tempus. Nullam sollicitudin non nisi at luctus. Proin pharetra, orci id egestas venenatis, nisl orci bibendum urna, dapibus ullamcorper nibh nisl a arcu. Aenean et gravida odio. Aliquam erat volutpat. Mauris convallis euismod nibh, in gravida metus luctus sed. Integer neque mauris, rhoncus ut tristique sed, malesuada id lorem.",
		createdAt: new Date(),
	},
	{
		id: 5,
		title: "title 5",
		body: "body 5",
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
