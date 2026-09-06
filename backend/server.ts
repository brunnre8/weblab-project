import type { AddressInfo } from "node:net";
import { dummyAdminUser } from "./middlewares/auth.ts";
import { SqliteStore } from "./stores/sqlite.ts";
import { createExpressApp } from "./express_setup.ts";

async function main() {
	const store = new SqliteStore(":memory:");

	if (!(await store.hasUsers())) {
		await store.insertUser(dummyAdminUser());
	}

	const app = createExpressApp(store);

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

await main();
