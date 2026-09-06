import express, { type Express } from "express";
import type { AddressInfo } from "node:net";
import { authMw, dummyAdminUser } from "./middlewares/auth.ts";
import { permissionErrorMw, noEntityErrorMw, badInputErrorMw, internalErrorMw } from "./middlewares/errors.ts";
import { SqliteStore } from "./stores/sqlite.ts";
import { TodoController } from "./todos/controller.ts";
import { TodoService } from "./todos/service.ts";
import type { TodoStore } from "./todos/todoStore.ts";
import type { UserStore } from "./users/userStore.ts";

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

export function createExpressApp(store: TodoStore & UserStore): Express {
	const app = express();
	app.disable("x-powered-by");
	app.use(permissionErrorMw());
	app.use(noEntityErrorMw());
	app.use(badInputErrorMw());
	app.use(internalErrorMw()); // keep this last

	const apiRouter = express.Router();
	apiRouter.use(authMw());
	apiRouter.use("/todos", new TodoController(new TodoService(store)).router());

	app.use("/api", apiRouter);
	return app;
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
