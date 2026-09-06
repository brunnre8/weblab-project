import { test, describe, beforeEach, afterEach, expect } from "vitest";
import { SqliteStore } from "../stores/sqlite.ts";
import { TodoService } from "./service.ts";
import { dummyTodo, dummyUser } from "../stores/sqlite.spec.ts";
import type { User, UserID } from "../users/models.ts";
import type { Todo, TodoInput } from "./models.ts";

describe("todo service check", () => {
	let service: TodoService;
	let sqliteStore: SqliteStore;

	let adminID: UserID;
	let billyID: UserID;
	let mariaID: UserID;

	let admin: User;
	let billy: User;
	let maria: User;

	beforeEach(async () => {
		sqliteStore = new SqliteStore(":memory:");
		[adminID, billyID, mariaID] = await populateDummy(sqliteStore);
		admin = dummyUser({ name: "admin", id: adminID });
		billy = dummyUser({ name: "billy", id: billyID });
		maria = dummyUser({ name: "maria", id: mariaID });
		service = new TodoService(sqliteStore);
	});

	afterEach(() => {
		sqliteStore.close();
	});

	describe("happy path", () => {
		test("list", async () => {
			await expect(service.listTodos(billyID)).resolves.toHaveLength(1);
		});

		test("read", async () => {
			const todo = (await sqliteStore.listTodos(billyID))[0];
			await expect(service.getTodo(todo.id, billy)).resolves.toStrictEqual(todo);
		});

		test("insert", async () => {
			const todo: TodoInput = dummyTodoInput({ ownerID: billyID });
			await expect(service.insertTodo(todo, billy)).resolves.toMatchObject(todo);
			await expect(service.listTodos(billyID)).resolves.toHaveLength(2);
		});

		test("update", async () => {
			const todo = (await sqliteStore.listTodos(billyID))[0];
			todo.title = "new title";
			todo.body = "new body";
			await service.updateTodo(todo.id, todo, billy);
		});

		test("delete", async () => {
			const todo = (await sqliteStore.listTodos(billyID))[0];
			todo.title = "new title";
			todo.body = "new body";
			await service.deleteTodo(todo.id, billy);
			await expect(service.listTodos(billyID)).resolves.toHaveLength(0);
		});
	});
});

async function populateDummy(db: SqliteStore): Promise<[UserID, UserID, UserID]> {
	const adminID = await db.insertUser(dummyUser({ name: "admin", role: "admin" }));
	const billyID = await db.insertUser(dummyUser({ name: "billy" }));
	const mariaID = await db.insertUser(dummyUser({ name: "maria" }));
	await db.insertTodo(dummyTodo({ title: "admin todo", ownerID: adminID }));
	await db.insertTodo(dummyTodo({ title: "billy Todo", ownerID: billyID }));
	await db.insertTodo(dummyTodo({ title: "maria todo", ownerID: mariaID }));
	return [adminID, billyID, mariaID];
}

function dummyTodoInput(props: Partial<Todo>): TodoInput {
	const todo = dummyTodo(props);
	delete (todo as any).id;
	return todo;
}
