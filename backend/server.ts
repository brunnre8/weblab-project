import type { AddressInfo } from "node:net";
import { dummyAdminUser } from "./middlewares/auth.ts";
import { SqliteStore } from "./stores/sqlite.ts";
import { createExpressApp } from "./express_setup.ts";
import { UserCreds } from "./users/models.ts";

const dummyTodos = [
	{
		title: "title A",
		body: "body A",
		createdAt: new Date(),
	},
	{
		title: "title B",
		body: "body B",
		createdAt: new Date(),
	},
	{
		title: "title B",
		body: "body B",
		createdAt: new Date(),
	},
	{
		title: "title B",
		body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a condimentum justo. Sed egestas tempor dapibus. Curabitur sit amet varius tortor. Phasellus ultricies purus in hendrerit venenatis. Vivamus ultricies sagittis nibh, sit amet luctus metus dapibus nec. Vivamus nec malesuada elit, eu egestas urna. Nullam mauris felis, vulputate ut augue eu, pretium laoreet nisl. Vestibulum non arcu a ipsum mattis tempus. Nullam sollicitudin non nisi at luctus. Proin pharetra, orci id egestas venenatis, nisl orci bibendum urna, dapibus ullamcorper nibh nisl a arcu. Aenean et gravida odio. Aliquam erat volutpat. Mauris convallis euismod nibh, in gravida metus luctus sed. Integer neque mauris, rhoncus ut tristique sed, malesuada id lorem.",
		createdAt: new Date(),
	},
	{
		title: "title 5",
		body: "body 5",
		createdAt: new Date(),
	},
];

async function main() {
	const store = new SqliteStore(":memory:");

	if (!(await store.hasUsers())) {
		const adminID = await store.insertUser(dummyAdminUser(), await UserCreds.fromPassword("admin".repeat(3)));
		await Promise.all(
			dummyTodos.map(async (t: any) => {
				t.ownerID = adminID;
				await store.insertTodo(t);
			}),
		);
	}

	const app = createExpressApp(store, store);

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
