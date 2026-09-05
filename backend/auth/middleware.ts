import { type RequestHandler, type Request } from "express";
import { type User } from "../users/models.ts";

// note: this isn't remotely pretty, but my TS foo is not good enough to pipe the request var
// through the RequestHandler type mess... so we forcefully mush it in.
// at least the damage is scoped to this module...

// Enforces an authenticated user, injecting the user context into req.user
export function authMw(): RequestHandler {
	return (req: any, _res, next) => {
		//TODO: actually implement this
		const user: User = {
			id: 1,
			name: "admin",
			role: "admin",
			email: "admin@localhost",
			disabled: false,
		};
		req.user = user;
		next();
	};
}

export function userFromRequest(req: Request): User {
	const user = (req as any).user;
	if (!user) {
		throw new Error("no user present, ensure authMw is in the middleware chain before you call this function");
	}
	return user;
}
