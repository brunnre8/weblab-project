import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoList } from "./todo-list";
import { provideRouter } from "@angular/router";

describe("TodoList", () => {
	let component: TodoList;
	let fixture: ComponentFixture<TodoList>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoList],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoList);
		fixture.componentRef.setInput("todos", []);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
