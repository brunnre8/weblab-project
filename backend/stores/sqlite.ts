import type { PathLike } from "node:fs";
import { DatabaseSync, type DatabaseSyncOptions, type SQLTagStore } from "node:sqlite";

const sqliteOptions: DatabaseSyncOptions = {
	timeout: 5000, //ms
};

// note: The current DB implementation is synchronous, blocking the event loop.
// However, for small to medium sites with low volume queries we might get away
// with it, if not we can shove this into a worker see
// https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/threads.md
// node.js is working on an async variant, as soon as that's available we can migrate
// this.
export class SqliteStore {
	#db: DatabaseSync;
	#sql: SQLTagStore;

	constructor(path: PathLike) {
		this.#db = new DatabaseSync(path, sqliteOptions);
		this.#sql = this.#db.createTagStore();
		this.runPragmas();
		this.migrate();
	}

	runPragmas() {
		this.#db.exec("PRAGMA journal_mode=WAL;");
	}

	migrate() {
		this.migrateVersion(migrations.length);
	}

	migrateVersion(length: number) {
		console.log("[SqliteStore]: running migrations, this can take a while...");
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
		console.log("[SqliteStore]: migrated");
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

var migrations = [
	"", // new db so full schema is applied
];

// init_schema is the first DB schema ever shipped.
// Never change this, add migrations
const init_schema = `
	CREATE TABLE todos (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		createdAt DATETIME NOT NULL
	);
`;
