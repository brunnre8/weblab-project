import { type RequestHandler, type Request } from "express";
import { type User } from "../users/models.ts";
import { ErrPerm } from "./errors.ts";
import type { AuthService } from "../auth/service.ts";
import { redirectToLogin } from "../auth/controller.ts";

// note: this isn't remotely pretty, but my TS foo is not good enough to pipe the request var
// through the RequestHandler type mess... so we forcefully mush it in.
// at least the damage is scoped to this module...

// Enforces an authenticated user, injecting the user context into req.user
export function authMw(authService: AuthService, cookieName: string): RequestHandler {
	return async (req: any, res, next) => {
		const token = req.cookies[cookieName];
		if (!token) {
			redirectToLogin(res);
			return;
		}
		const user = await authService.userFromToken(token);
		if (user === null) {
			redirectToLogin(res);
			return;
		}
		req.user = user;
		next();
	};
}

// only allows admins
export function adminOnlyMw(): RequestHandler {
	return (req: any, _res, next) => {
		const user = userFromRequest(req);
		if (user.role !== "admin") {
			throw new ErrPerm("permission denied for non admin users");
		}
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

export function dummyAdminUser(): User {
	return {
		id: 1,
		name: "admin",
		role: "admin",
		email: "admin@localhost",
		disabled: false,
	};
}
