import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoSingle } from "./todo-single";

describe("TodoSingle", () => {
	let component: TodoSingle;
	let fixture: ComponentFixture<TodoSingle>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoSingle],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoSingle);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
