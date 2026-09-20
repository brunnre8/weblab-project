import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoFull } from "./todo-full";
import { Todo } from "../../../../models/todo";

describe("TodoFull", () => {
	let component: TodoFull;
	let fixture: ComponentFixture<TodoFull>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoFull],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoFull);
		const todo: Todo = {
			id: 1,
			title: "title",
			body: "body",
			createdAt: new Date(),
			ownerID: 1,
		};
		fixture.componentRef.setInput("todo", todo);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
