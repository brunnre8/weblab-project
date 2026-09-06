import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { type Express } from "express";
import request, { type SuperTestStatic } from "supertest";

import { createExpressApp } from "./server.ts";
import { dummyAdminUser } from "./middlewares/auth.ts";
import { SqliteStore } from "./stores/sqlite.ts";
import type { User } from "./users/models.ts";
import { dummyTodo, dummyUser } from "./stores/sqlite.spec.ts";
import type { Todo, TodoInput } from "./todos/models.ts";

describe("server integration test", () => {
	let app: Express;
	let store: SqliteStore;
	let req: ReturnType<SuperTestStatic>;

	let admin: User;
	let billy: User;
	let maria: User;

	beforeEach(async () => {
		store = new SqliteStore(":memory:");
		[admin, billy, maria] = await populateDummy(store);
		app = createExpressApp(store);
		req = request(app);

		if (!(await store.hasUsers())) {
			await store.insertUser(dummyAdminUser());
		}
	});

	afterEach(() => {
		store.close();
	});

	describe("todo controller", () => {
		test("get /api/todos/", async () => {
			const response = await req.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toHaveLength(1);
			expect(response.body[0]).toMatchObject({ title: "admin todo", ownerID: admin.id });
		});

		test("delete /api/todos/:id", async () => {
			let response = await req.delete("/api/todos/1");
			expect(response.status).toBe(200);

			// check that it did the trick
			response = await req.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toHaveLength(0);
		});

		test("put /api/todos/:id", async () => {
			// setup
			let response = await req.get("/api/todos/");
			const todo: Todo = response.body[0];
			const expectedTitle = "new title";
			todo.title = expectedTitle;

			// execute
			response = await req.put(`/api/todos/${todo.id}`).send(todo);
			expect(response.status).toBe(200);

			// validate
			response = await req.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.body[0].title).toBe(expectedTitle);
		});

		test("post /api/todos/new", async () => {
			// setup
			const todo: TodoInput = dummyTodo({ title: "whatever", ownerID: admin.id });
			delete (todo as any).id;

			// execute
			let response = await req.post(`/api/todos/new`).send(todo);
			expect(response.status).toBe(201);

			// validate
			response = await req.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.body).toHaveLength(2);
			const filtered = response.body.filter((a: Todo) => a.title === todo.title);
			expect(filtered).toHaveLength(1);
			const received = filtered[0];
			// the testing thingy doesn't parse the date
			received.createdAt = new Date(received.createdAt);
			expect(received).toMatchObject(todo);
		});
	});
});

async function populateDummy(db: SqliteStore): Promise<[User, User, User]> {
	const admin = dummyUser({ name: "admin", role: "admin" });
	admin.id = await db.insertUser(admin);
	const billy = dummyUser({ name: "billy" });
	billy.id = await db.insertUser(billy);
	const maria = dummyUser({ name: "maria" });
	maria.id = await db.insertUser(maria);
	await db.insertTodo(dummyTodo({ title: "admin todo", ownerID: admin.id }));
	await db.insertTodo(dummyTodo({ title: "billy Todo", ownerID: billy.id }));
	await db.insertTodo(dummyTodo({ title: "maria todo", ownerID: maria.id }));
	return [admin, billy, maria];
}
