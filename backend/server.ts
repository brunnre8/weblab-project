import express, { type ErrorRequestHandler } from "express";
import type { AddressInfo } from "node:net";
import { authMw, userFromRequest } from "./auth/middleware.ts";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	console.error(err.stack);
	res.sendStatus(500);
};

const app = express();
app.disable("x-powered-by");
app.use(errorHandler);

const apiRouter = express.Router();
apiRouter.use(authMw());

apiRouter.get("/user", async (req, res) => {
	const user = userFromRequest(req);
	res.status(200);
	res.json(user);
});

app.use("/api", apiRouter);

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
