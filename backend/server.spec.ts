import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { type Express } from "express";
import supertest, { type Agent, type SuperTestStatic } from "supertest";

import { createExpressApp } from "./express_setup.ts";
import { SqliteStore } from "./stores/sqlite.ts";
import { UserCreds, type User } from "./users/models.ts";
import { dummyTodo, dummyUser } from "./stores/sqlite.spec.ts";
import type { Todo, TodoInput } from "./todos/models.ts";

const ADMIN_PW = "admin".repeat(4);

describe("server integration test", () => {
	let app: Express;
	let store: SqliteStore;
	let agent: Agent;

	let admin: User;
	let billy: User;
	let maria: User;

	beforeEach(async () => {
		store = new SqliteStore(":memory:");
		[admin, billy, maria] = await populateDummy(store);
		app = createExpressApp(store, store, true);
		agent = supertest.agent(app);
		agent.set("sec-fetch-site", "same-origin");
		await agent.post("/auth/login").send({ email: admin.email, password: ADMIN_PW });
	});

	afterEach(() => {
		store.close();
	});

	describe("user controller", () => {
		test("get /api/users/", async () => {
			const response = await agent.get("/api/users/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toMatchObject([admin, billy, maria]);
		});

		test("delete /api/todos/:id", async () => {
			let response = await agent.delete(`/api/users/${billy.id}`);
			expect(response.status).toBe(200);

			// check that it did the trick
			response = await agent.get("/api/users/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toMatchObject([admin, maria]);
		});

		test("put /api/users/:id", async () => {
			// setup
			const newBilly = { ...billy };
			let response = await agent.get("/api/users/");
			const expectedName = "No longer Billy";
			const expectedRole = "admin";
			newBilly.name = expectedName;
			newBilly.role = expectedRole;

			// execute
			response = await agent.put(`/api/users/${billy.id}`).send(newBilly);
			expect(response.status).toBe(200);

			// validate
			const resp = await agent.get("/api/users/");
			expect(response.status).toBe(200);
			const updated = resp.body.filter((u: User) => u.id === billy.id)[0];
			expect(updated).toEqual(newBilly);
		});

		test("post /api/users/new", async () => {
			// setup
			const eva = dummyUser({ name: "eva", role: "admin", disabled: true });
			delete (eva as any)["id"];

			// execute
			let response = await agent.post("/api/users/new").send({
				user: eva,
				password: "a".repeat(15),
			});
			expect(response.status).toBe(201);

			// validate
			response = await agent.get("/api/users/");
			expect(response.status).toBe(200);
			expect(response.body).toMatchObject([admin, billy, maria, eva]);
		});
	});

	describe("todo controller", () => {
		test("get /api/todos/", async () => {
			const response = await agent.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toHaveLength(1);
			expect(response.body[0]).toMatchObject({ title: "admin todo", ownerID: admin.id });
		});

		test("get /api/todos/:id", async () => {
			let response = await agent.get("/api/todos/1");
			expect(response.status).toBe(200);
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toMatchObject({
				title: "admin todo",
				body: "Lorem ipsum dolor achmet...",
				ownerID: admin.id,
			});
		});

		test("delete /api/todos/:id", async () => {
			let response = await agent.delete("/api/todos/1");
			expect(response.status).toBe(200);

			// check that it did the trick
			response = await agent.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.headers["content-type"]).toMatch(/^application\/json;/);
			expect(response.body).toHaveLength(0);
		});

		test("put /api/todos/:id", async () => {
			// setup
			let response = await agent.get("/api/todos/");
			const todo: Todo = response.body[0];
			const expectedTitle = "new title";
			todo.title = expectedTitle;

			// execute
			response = await agent.put(`/api/todos/${todo.id}`).send(todo);
			expect(response.status).toBe(200);

			// validate
			response = await agent.get("/api/todos/");
			expect(response.status).toBe(200);
			expect(response.body[0].title).toBe(expectedTitle);
		});

		test("post /api/todos/new", async () => {
			// setup
			const todo: TodoInput = dummyTodo({ title: "whatever", ownerID: admin.id });
			delete (todo as any).id;

			// execute
			let response = await agent.post(`/api/todos/new`).send(todo);
			expect(response.status).toBe(201);

			// validate
			response = await agent.get("/api/todos/");
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

	//TODO: permission tests once login is possible

	describe("404 errors", () => {
		test("get todos", async () => {
			const resp = await agent.get("/api/todos/-1");
			expect(resp.status).toBe(404);
		});
		test("delete todos", async () => {
			const resp = await agent.delete("/api/todos/-1");
			expect(resp.status).toBe(404);
		});
		test("update todos", async () => {
			const resp = await agent.put("/api/todos/-1").send(dummyTodo());
			expect(resp.status).toBe(404);
		});
		test("update user", async () => {
			const resp = await agent.put("/api/users/-1").send(dummyUser());
			expect(resp.status).toBe(404);
		});
		test("delete user", async () => {
			const resp = await agent.delete("/api/users/-1");
			expect(resp.status).toBe(404);
		});
	});
});

async function populateDummy(db: SqliteStore): Promise<[User, User, User]> {
	const admin = dummyUser({ name: "admin", role: "admin" });
	const adminCreds = await UserCreds.fromPassword(ADMIN_PW);
	admin.id = await db.insertUser(admin, adminCreds);
	const billy = dummyUser({ name: "billy" });
	billy.id = await db.insertUser(billy);
	const maria = dummyUser({ name: "maria" });
	maria.id = await db.insertUser(maria);
	await db.insertTodo(dummyTodo({ title: "admin todo", ownerID: admin.id }));
	await db.insertTodo(dummyTodo({ title: "billy Todo", ownerID: billy.id }));
	await db.insertTodo(dummyTodo({ title: "maria todo", ownerID: maria.id }));
	return [admin, billy, maria];
}
