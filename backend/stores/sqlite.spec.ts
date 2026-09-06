import { test, describe, beforeEach, expect } from "vitest";
import { SqliteStore } from "./sqlite.ts";
import { ErrNoRows } from "./errors.ts";
import type { User } from "../users/models.ts";
import type { UserStore } from "../users/userStore.ts";
import type { TodoStore } from "../todos/todoStore.ts";
import type { Todo } from "../todos/models.ts";

describe("sqlite userStore", () => {
	let db: UserStore;

	beforeEach(() => {
		db = new SqliteStore(":memory:");
	});

	describe("404s", () => {
		test("getUserById", async () => {
			await expect(db.getUserById(-1)).rejects.toThrow(ErrNoRows);
		});

		test("updateUser", async () => {
			await expect(db.updateUser(dummyUser())).rejects.toThrow(ErrNoRows);
		});

		test("listUsers", async () => {
			await expect(db.listUsers()).resolves.toHaveLength(0);
		});
	});

	describe("roundtrips", () => {
		test("getUserById", async () => {
			const user = dummyUser({ role: "admin" });
			user.id = await db.insertUser(user);
			// we want the userid to be ignored for inserts
			expect(user.id).not.toBe(-1);
			const dbUser = await db.getUserById(user.id);
			expect(dbUser).toStrictEqual(user);
		});

		test("updateUser", async () => {
			const user = dummyUser({ role: "admin" });
			user.id = await db.insertUser(user);
			user.role = "user";
			expect(db.updateUser(user)).resolves;
			const dbUser = await db.getUserById(user.id);
			expect(dbUser).toStrictEqual(user);
		});

		test("listUsers", async () => {
			const userA = dummyUser({ name: "billy" });
			const userB = dummyUser({ name: "marry" });
			const userList = [userA, userB];
			[userA.id, userB.id] = await Promise.all(userList.map((u) => db.insertUser(u)));
			const dbList = await db.listUsers();
			expect(dbList).toHaveLength(2);
			expect(dbList).toStrictEqual(userList);
		});
	});

	describe("validity", () => {
		test("duplicate email disallowed", async () => {
			const userA = dummyUser({ name: "billy", email: "one@example.com" });
			const userB = dummyUser({ name: "marry", email: "one@example.com" });
			await db.insertUser(userA);
			await expect(db.insertUser(userB)).rejects.toThrow(/email/);
		});
	});
});

describe("sqlite todoStore", () => {
	let db: TodoStore;

	beforeEach(async () => {
		const sqliteDB = new SqliteStore(":memory:");
		db = sqliteDB;
		await sqliteDB.insertUser(dummyUser({ role: "admin" }));
	});

	describe("404s", () => {
		test("getTodo", async () => {
			await expect(db.getTodo(-1)).rejects.toThrow(ErrNoRows);
		});

		test("updateTodo", async () => {
			await expect(db.updateTodo(dummyTodo())).rejects.toThrow(ErrNoRows);
		});

		test("listTodos", async () => {
			await expect(db.listTodos()).resolves.toHaveLength(0);
		});
	});

	describe("roundtrips", () => {
		test("getTodo", async () => {
			const todo = dummyTodo();
			todo.id = await db.insertTodo(todo);
			// we want the userid to be ignored for inserts
			expect(todo.id).not.toBe(-1);
			const dbtodo = await db.getTodo(todo.id);
			expect(dbtodo).toStrictEqual(todo);
		});

		test("updateTodo", async () => {
			const todo = dummyTodo();
			todo.id = await db.insertTodo(todo);
			todo.body = "new body";
			todo.title = "new title";
			expect(db.updateTodo(todo)).resolves;
			const dbTodo = await db.getTodo(todo.id);
			expect(dbTodo).toStrictEqual(todo);
		});

		test("listTodos", async () => {
			const todoA = dummyTodo({ title: "one" });
			const todoB = dummyTodo({ title: "two" });
			const todoList = [todoA, todoB];
			[todoA.id, todoB.id] = await Promise.all(todoList.map((u) => db.insertTodo(u)));
			const dbList = await db.listTodos();
			expect(dbList).toHaveLength(2);
			expect(dbList).toStrictEqual(todoList);
		});
	});
});

function dummyUser(props?: Partial<User>): User {
	return {
		id: -1,
		name: "dummy",
		email: "dummy@example.com",
		role: "user",
		disabled: false,
		// email has a unique constraint, so ensure we don't collide by default
		...(props?.name ? { email: props.name + "@example.com" } : {}),
		...props,
	};
}

function dummyTodo(props?: Partial<Todo>): Todo {
	return {
		id: -1,
		title: "Dummy title",
		body: "Lorem ipsum dolor achmet...",
		createdAt: new Date(),
		ownerID: 1,
		...props,
	};
}
