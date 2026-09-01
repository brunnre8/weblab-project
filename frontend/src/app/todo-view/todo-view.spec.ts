import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoView } from "./todo-view";

import "temporal-polyfill/global"; // monkey patches the temporal API into safari
import { provideRouter } from "@angular/router";

describe("TodoView", () => {
	let component: TodoView;
	let fixture: ComponentFixture<TodoView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoView],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoView);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
