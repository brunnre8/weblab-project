import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoNew } from "./todo-new";

describe("TodoNew", () => {
	let component: TodoNew;
	let fixture: ComponentFixture<TodoNew>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoNew],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoNew);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
