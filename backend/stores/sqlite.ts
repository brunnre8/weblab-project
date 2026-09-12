import type { UserCredsWithID, UserStore } from "../users/userStore.ts";
import type { PathLike } from "node:fs";
import { DatabaseSync, type DatabaseSyncOptions, type SQLTagStore } from "node:sqlite";
import { type UserID, type User, UserCreds } from "../users/models.ts";
import { ErrConstraint, ErrNoRows } from "./errors.ts";
import type { TodoStore } from "../todos/todoStore.ts";
import type { TodoID, Todo } from "../todos/models.ts";

const sqliteOptions: DatabaseSyncOptions = {
	timeout: 5000, //ms
};

// https://sqlite.org/rescode.html
// node shoves them into err.errcode
const ERRCODE_SQLITE_CONSTRAINT_UNIQUE = 2067;

// note: The current DB implementation is synchronous, blocking the event loop.
// However, for small to medium sites with low volume queries we might get away
// with it, if not we can shove this into a worker see
// https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/threads.md
// node.js is working on an async variant, as soon as that's available we can migrate
// this.
export class SqliteStore implements UserStore, TodoStore {
	#db: DatabaseSync;
	#sql: SQLTagStore;

	constructor(path: PathLike) {
		this.#db = new DatabaseSync(path, sqliteOptions);
		this.#sql = this.#db.createTagStore();
		this.runPragmas();
		this.migrate();
	}

	async getUserById(id: UserID): Promise<User> {
		const val = this.#sql.get`SELECT * from users WHERE id = ${id}`;
		if (val === undefined) {
			throw new ErrNoRows(`no user with id ${id}`);
		}
		return toUser(val);
	}

	async getUserCredsByEmail(email: string): Promise<UserCredsWithID> {
		const val = this.#sql.get`
			SELECT * from user_creds
			WHERE userid in (
				SELECT userid from users
				where email = ${email}
			);
		`;
		if (val === undefined) {
			throw new ErrNoRows(`no creds for email ${email}`);
		}
		return toUserCreds(val);
	}

	async insertUserCreds(userID: UserID, creds: UserCreds): Promise<void> {
		try {
			const change = this.#sql.run`
				INSERT INTO user_creds
				(userid, pwhash, salt)
				VALUES
				(${userID}, ${creds.pwHash}, ${creds.salt})
			`;
			if (change.changes != 1) {
				throw new Error("insert failed");
			}
		} catch (err) {
			if (isConstraintErr(err)) {
				throw asConstraintErr(err);
			}
			throw err;
		}
	}

	async updateUserCreds(userID: UserID, creds: UserCreds): Promise<void> {
		const change = this.#sql.run`
		UPDATE user_creds
		set pwhash = ${creds.pwHash}, salt = ${creds.salt}
		WHERE userid = ${userID}
		`;
		if (change.changes != 1) {
			throw new Error("update failed");
		}
	}

	async listUsers(): Promise<User[]> {
		return this.#sql.all`SELECT * from users order by id`.map(toUser);
	}

	async hasUsers(): Promise<boolean> {
		const row = this.#sql.get`SELECT 1 from users limit 1;`;
		return row !== undefined;
	}

	async insertUser(user: User, creds?: UserCreds): Promise<UserID> {
		this.#db.exec("BEGIN TRANSACTION;");
		try {
			const row = this.#sql.get`
				INSERT INTO users
				(name, email, role, disabled)
				VALUES
				(${user.name}, ${user.email}, ${user.role}, ${bool(user.disabled)})
				returning id;
				`;
			if (row == undefined) {
				throw new Error("didn't get uid back from insert");
			}
			const userID = row.id as UserID;
			if (creds !== undefined) {
				await this.insertUserCreds(userID, creds);
			}
			this.#db.exec("COMMIT;");
			return userID;
		} catch (err) {
			this.#db.exec("ROLLBACK;");
			if (isConstraintErr(err)) {
				throw asConstraintErr(err);
			}
			throw err;
		}
	}

	async updateUser(user: User): Promise<void> {
		try {
			const changes = this.#sql.run`
				UPDATE users
				set name = ${user.name}, email = ${user.email}, role = ${user.role}, disabled = ${bool(user.disabled)}
				WHERE id = ${user.id};
			`;
			if (changes.changes != 1) {
				throw new ErrNoRows(`no user with id ${user.id}`);
			}
		} catch (err) {
			if (isConstraintErr(err)) {
				throw asConstraintErr(err);
			}
			throw err;
		}
	}

	async deleteUser(userID: UserID): Promise<void> {
		const changes = this.#sql.run`
			DELETE FROM users
			WHERE id = ${userID};
		`;
		if (changes.changes != 1) {
			throw new ErrNoRows(`no user with id ${userID}`);
		}
	}

	async getTodo(id: TodoID): Promise<Todo> {
		const val = this.#sql.get`SELECT * from todos WHERE id = ${id}`;
		if (val === undefined) {
			throw new ErrNoRows(`no todo with id ${id}`);
		}
		return toTodo(val);
	}

	async listTodos(ownerID: UserID): Promise<Todo[]> {
		return this.#sql.all`
			SELECT *
			FROM todos
			WHERE ownerID = ${ownerID}
			ORDER BY id DESC
		`.map(toTodo);
	}

	async insertTodo(todo: Omit<Todo, "id">): Promise<TodoID> {
		const row = this.#sql.get`
		INSERT INTO todos
		(title, body, createdAt, ownerID)
		VALUES
		(${todo.title}, ${todo.body}, ${sqDate(todo.createdAt)}, ${todo.ownerID})
		returning id;
		`;
		if (row == undefined) {
			throw new Error("didn't get id back from insert");
		}
		return row.id as TodoID;
	}

	async updateTodo(todo: Todo): Promise<void> {
		const changes = this.#sql.run`
		UPDATE todos
		set
			title = ${todo.title}, body = ${todo.body}, createdAt = ${sqDate(todo.createdAt)},
			ownerID = ${todo.ownerID}
		WHERE id = ${todo.id}
		`;
		if (changes.changes != 1) {
			throw new ErrNoRows(`no user with id ${todo.id}`);
		}
	}

	async deleteTodo(id: TodoID): Promise<void> {
		const changes = this.#sql.run`DELETE FROM todos WHERE id = ${id}`;
		if (changes.changes != 1) {
			throw new ErrNoRows(`no todo with id ${id}`);
		}
	}

	runPragmas() {
		this.#db.exec("PRAGMA journal_mode=WAL;");
	}

	migrate() {
		this.migrateVersion(migrations.length);
	}

	migrateVersion(newVersion: number) {
		this.#db.exec("BEGIN EXCLUSIVE TRANSACTION;");
		const dbVersion = this.getSchemaVersion();
		if (dbVersion === 0) {
			this.#db.exec(init_schema);
		} else if (dbVersion > newVersion) {
			throw new Error(`db version ${dbVersion} newer than us (${newVersion}). Refusing to operate`);
		} else {
			// up to date
			this.#db.exec("ROLLBACK;");
			return;
		}
		for (const stmt of migrations.slice(dbVersion)) {
			this.#db.exec(stmt);
		}
		this.setSchemaVersion(newVersion);
		this.#db.exec("COMMIT;");
	}

	getSchemaVersion(): number {
		const ret = this.#sql.get`PRAGMA user_version`;
		const version = ret?.user_version;
		if (version == null) {
			throw new Error("couldn't get db version");
		}
		if (typeof version !== "number") {
			throw new Error("unexpected type return from user_version pragma");
		}
		return version;
	}

	private setSchemaVersion(version: number) {
		// sqlite doesn't seem to like placeholders in pragmas...
		// but the input here is trusted so we can just str interpolate it
		this.#db.exec(`PRAGMA user_version = ${version}`);
	}

	close() {
		this.#db.close();
	}
}

function bool(b: boolean): number {
	return b ? 1 : 0;
}

function sqDate(d: Date): number {
	return d.valueOf();
}

function fromSqDate(d: number): Date {
	return new Date(d);
}

function toUser(raw: any): User {
	// sql type isn't helping here so... hope that the tests find the bugs ;)
	return {
		id: raw.id,
		name: raw.name,
		email: raw.email,
		disabled: raw.disabled == 1, // sqlite stores int, no bool type
		role: raw.role,
	};
}

function toTodo(raw: any): Todo {
	return {
		id: raw.id,
		title: raw.title,
		body: raw.body,
		createdAt: fromSqDate(raw.createdAt),
		ownerID: raw.ownerID,
	};
}

function toUserCreds(raw: any): UserCredsWithID {
	const creds = new UserCreds(raw.pwhash, raw.salt);
	return {
		creds: creds,
		userID: raw.userid,
	};
}

// init_schema is the first DB schema ever shipped.
// Never change this, add migrations instead
const init_schema = `
	CREATE TABLE todos (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		createdAt DATETIME NOT NULL,
		ownerID INTEGER NOT NULL REFERENCES users ON DELETE CASCADE
	);

	CREATE TABLE users (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		role TEXT NOT NULL,
		disabled INTEGER NOT NULL
	);

	CREATE TABLE user_creds (
		id INTEGER PRIMARY KEY,
		userid INTEGER UNIQUE NOT NULL REFERENCES users ON DELETE CASCADE,
		pwhash BLOB NOT NULL,
		salt BLOB NOT NULL
	);
`;

var migrations = [
	"", // new db so full schema is applied
];

function isConstraintErr(err: unknown): boolean {
	if (typeof err !== "object") {
		return false;
	}
	return (err as any).errcode === ERRCODE_SQLITE_CONSTRAINT_UNIQUE;
}

function asConstraintErr(err: any): Error {
	return new ErrConstraint(err.message, { cause: err });
}
