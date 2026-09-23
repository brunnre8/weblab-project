import type { AddressInfo } from "node:net";
import { SqliteStore } from "./stores/sqlite.ts";
import { createExpressApp } from "./express_setup.ts";
import { UserCreds } from "./users/models.ts";
import { dummyTodos } from "./dummyTodos.ts";
import { genRandom } from "./auth/service.ts";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function main() {
	const statedir = process.env.TODO_STATE_DIR ?? ".state";
	await mkdir(statedir, { recursive: true });
	const store = new SqliteStore(path.join(statedir, "store.sqlite"));

	if (!(await store.hasUsers())) {
		await populateAdmin(store);
	}

	const insecure = !!process.env.TODO_INSECURE_COOKIES;
	const app = createExpressApp(store, store, insecure);

	const server = app.listen(4444, (err) => {
		if (err) {
			console.error(err.message);
			return;
		}
		const addr = server.address();
		if (addr) {
			printAddr(addr);
		}
	});

	process.on("SIGTERM", () => {
		console.log("SIGTERM signal received. Shutting down...");
		server.close(() => {
			console.log("HTTP server closed");
			store.close();
			console.log("Store closed");
		});
	});
}

function printAddr(addr: string | AddressInfo) {
	let listener: string;
	if (!addr) {
		return;
	} else if (typeof addr === "string") {
		listener = addr;
	} else {
		const host = addr.family === "IPv6" ? `[${addr.address}]` : addr.address;
		listener = `http://${host}:${addr.port}`;
	}
	console.log(`started on ${listener}`);
}

async function populateAdmin(store: SqliteStore) {
	const user = { name: "admin", role: "admin", email: "admin@localhost", disabled: false } as const;
	const pw = await genRandom(20);
	const adminID = await store.insertUser(user, await UserCreds.fromPassword(pw));
	await Promise.all(
		dummyTodos.map(async (t: any) => {
			t.ownerID = adminID;
			await store.insertTodo(t);
		}),
	);
	console.log("=".repeat(40));
	console.log(`admin user created, log in with:\n\tuser: ${user.email}\n\tpw: ${pw}`);
	console.log("\nTHIS MESSAGE WILL ONLY BE SHOWN THIS ONCE\n");
	console.log("=".repeat(40));
}

await main();
