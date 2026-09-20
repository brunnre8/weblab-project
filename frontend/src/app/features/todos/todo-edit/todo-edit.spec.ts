import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoEdit } from "./todo-edit";

describe("TodoEdit", () => {
	let component: TodoEdit;
	let fixture: ComponentFixture<TodoEdit>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoEdit],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoEdit);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
