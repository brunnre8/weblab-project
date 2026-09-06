import type { UserStore } from "../users/userStore.ts";
import type { PathLike } from "node:fs";
import { DatabaseSync, type DatabaseSyncOptions, type SQLOutputValue, type SQLTagStore } from "node:sqlite";
import type { UserID, User, UserCreds } from "../users/models.ts";
import { ErrNoRows } from "./errors.ts";

const sqliteOptions: DatabaseSyncOptions = {
	timeout: 5000, //ms
};

// note: The current DB implementation is synchronous, blocking the event loop.
// However, for small to medium sites with low volume queries we might get away
// with it, if not we can shove this into a worker see
// https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/threads.md
// node.js is working on an async variant, as soon as that's available we can migrate
// this.
export class SqliteStore implements UserStore {
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

	async getUserCredsByEmail(email: string): Promise<UserCreds> {
		throw new Error("Method not implemented.");
	}

	async listUsers(): Promise<User[]> {
		return this.#sql.all`SELECT * from users order by id`.map(toUser);
	}

	async hasUsers(): Promise<boolean> {
		const row = this.#sql.get`SELECT 1 from users limit 1;`;
		return row !== undefined;
	}

	async insertUser(user: User): Promise<UserID> {
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
		return row.id as UserID;
	}

	async updateUser(user: User): Promise<void> {
		const changes = this.#sql.run`
		UPDATE users
		set name = ${user.name}, email = ${user.email}, role = ${user.role}, disabled = ${bool(user.disabled)}
		WHERE id = ${user.id}
		`;
		if (changes.changes != 1) {
			throw new ErrNoRows(`no user with id ${user.id}`);
		}
	}

	runPragmas() {
		this.#db.exec("PRAGMA journal_mode=WAL;");
	}

	migrate() {
		this.migrateVersion(migrations.length);
	}

	migrateVersion(length: number) {
		this.#db.exec("BEGIN EXCLUSIVE TRANSACTION;");
		const dbVersion = this.getSchemaVersion();
		if (dbVersion === 0) {
			this.#db.exec(init_schema);
		} else if (dbVersion > migrations.length) {
			throw new Error(`db version ${dbVersion} newer than us (${migrations.length}). Refusing to operate`);
		} else {
			// up to date
			this.#db.exec("ROLLBACK;");
			return;
		}
		for (const stmt of migrations) {
			this.#db.exec(stmt);
		}
		this.setSchemaVersion(migrations.length);
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

// init_schema is the first DB schema ever shipped.
// Never change this, add migrations instead
const init_schema = `
	CREATE TABLE todos (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		createdAt DATETIME NOT NULL,
		ownerID INTEGER UNIQUE NOT NULL REFERENCES users ON DELETE CASCADE
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
