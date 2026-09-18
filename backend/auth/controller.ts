import express, { type CookieOptions, type Router } from "express";
import type { AuthService } from "./service.ts";
import { ErrBadInput, mustString } from "../helpers/conversions.ts";

const authCookieTemplate: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	path: "/",
};

export class AuthController {
	#authService: AuthService;
	#router: Router;
	#authCookieName: string;

	constructor(authService: AuthService) {
		this.#authService = authService;
		this.#authCookieName = cookieName("authtoken");
		this.#router = express.Router();
		this.registerRoutes();
	}

	private registerRoutes() {
		this.#router.post("/login", async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const email = mustString(req.body.email);
			const password = mustString(req.body.password);
			const token = await this.#authService.login(email, password);
			res.cookie(this.#authCookieName, token.token, {
				...authCookieTemplate,
				expires: nowInMonths(1),
			});
			res.redirect(303, "/");
		});

		this.#router.post("/logout", async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const token = req.cookies[this.#authCookieName];
			if (!token) {
				throw new ErrBadInput("logout with no token");
			}
			await this.#authService.logout(token);
			res.clearCookie(this.#authCookieName, {
				...authCookieTemplate,
			});
			res.redirect(303, "/login");
		});
	}

	router(): Router {
		return this.#router;
	}
}

function cookieName(name: string): string {
	return `__Host-Http-${name}`;
}

function nowInMonths(months: number): Date {
	const date = new Date();
	date.setMonth(date.getMonth() + months);
	return date;
}
