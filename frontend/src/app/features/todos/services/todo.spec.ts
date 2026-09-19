import { TestBed } from "@angular/core/testing";

import { TodoService } from "./todo";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { Todo } from "../../../models/todo";

describe("Todo", () => {
	let httpTesting: HttpTestingController;
	let service: TodoService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		service = TestBed.inject(TodoService);
	});

	afterEach(() => {
		httpTesting.verify();
	});

	it("should list all", async () => {
		const todos = service.allTodos();
		TestBed.tick();
		expect(todos.isLoading()).toBe(true);
		const req = httpTesting.expectOne("/api/todos/");
		req.flush(dummyTodos);
		await vi.waitUntil(() => todos.hasValue());
		expect(todos.value()).toMatchObject(dummyTodos);
	});
});

const dummyTodos: Todo[] = [
	{
		id: 1,
		title: "title A",
		body: "body A",
		createdAt: new Date(),
		ownerID: 1,
	},
	{
		id: 2,
		title: "title B",
		body: "body B",
		createdAt: new Date(),
		ownerID: 1,
	},
];
