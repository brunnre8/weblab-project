import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoFull } from "./todo-full";

describe("TodoFull", () => {
	let component: TodoFull;
	let fixture: ComponentFixture<TodoFull>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TodoFull],
		}).compileComponents();

		fixture = TestBed.createComponent(TodoFull);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
