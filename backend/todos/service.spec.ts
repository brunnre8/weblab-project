import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { SqliteStore } from "../stores/sqlite.ts";
import { TodoService } from "./service.ts";
import { dummyTodo, dummyUser } from "../stores/sqlite.spec.ts";
import type { User, UserID } from "../users/models.ts";
import type { Todo, TodoInput } from "./models.ts";
import { ErrPerm } from "../middlewares/errors.ts";

describe("todo service check", () => {
	let service: TodoService;
	let sqliteStore: SqliteStore;

	let admin: User;
	let billy: User;
	let maria: User;

	beforeEach(async () => {
		sqliteStore = new SqliteStore(":memory:");
		[admin, billy, maria] = await populateDummy(sqliteStore);
		service = new TodoService(sqliteStore);
	});

	afterEach(() => {
		sqliteStore.close();
	});

	describe("happy path", () => {
		test("list", async () => {
			await expect(service.listTodos(billy.id)).resolves.toHaveLength(1);
		});

		test("read", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			await expect(service.getTodo(todo.id, billy)).resolves.toStrictEqual(todo);
		});

		test("insert", async () => {
			const todo: TodoInput = dummyTodoInput({ ownerID: billy.id });
			await expect(service.insertTodo(todo, billy)).resolves.toMatchObject(todo);
			await expect(service.listTodos(billy.id)).resolves.toHaveLength(2);
		});

		test("update", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			todo.title = "new title";
			todo.body = "new body";
			await service.updateTodo(todo.id, todo, billy);
		});

		test("delete", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			todo.title = "new title";
			todo.body = "new body";
			await service.deleteTodo(todo.id, billy);
			await expect(service.listTodos(billy.id)).resolves.toHaveLength(0);
		});
	});

	describe("admin can do it", () => {
		test("get - admins", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			await expect(service.getTodo(todo.id, admin)).resolves.toStrictEqual(todo);
		});
	});

	describe("no permission", () => {
		test("get - users", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			await expect(service.getTodo(todo.id, maria)).rejects.toThrow(ErrPerm);
		});

		test("delete - admins", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			await expect(service.deleteTodo(todo.id, admin)).rejects.toThrow(ErrPerm);
		});

		test("delete - users", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			await expect(service.deleteTodo(todo.id, maria)).rejects.toThrow(ErrPerm);
		});

		test("update - admins", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			todo.title = "new title";
			todo.body = "new body";
			await expect(service.deleteTodo(todo.id, admin)).rejects.toThrow(ErrPerm);
		});

		test("update - users", async () => {
			const todo = (await sqliteStore.listTodos(billy.id))[0];
			todo.title = "new title";
			todo.body = "new body";
			await expect(service.deleteTodo(todo.id, maria)).rejects.toThrow(ErrPerm);
		});

		test("insert forces owner - admins", async () => {
			const todo = dummyTodoInput({ ownerID: billy.id });
			const newTodo = await service.insertTodo(todo, admin);
			expect(newTodo.ownerID).toBe(admin.id);
		});

		test("insert forces owner - users", async () => {
			const todo = dummyTodoInput({ ownerID: billy.id });
			const newTodo = await service.insertTodo(todo, maria);
			expect(newTodo.ownerID).toBe(maria.id);
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

function dummyTodoInput(props: Partial<Todo>): TodoInput {
	const todo = dummyTodo(props);
	delete (todo as any).id;
	return todo;
}
