import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoView } from "./todo-view";

import { provideRouter } from "@angular/router";
import { Todo } from "../../../models/todo";

const dummyTodo: Todo = {
	id: 0,
	title: "title",
	body: "body",
	createdAt: new Date(),
	ownerID: 0,
};

describe("TodoView", () => {
	let component: TodoView;
	let fixture: ComponentFixture<TodoView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoView],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoView);
		fixture.componentRef.setInput("todo", dummyTodo);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
