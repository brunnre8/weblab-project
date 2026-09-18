import express, { type CookieOptions, type Router } from "express";
import type { AuthService } from "./service.ts";
import { ErrBadInput, mustString } from "../helpers/conversions.ts";
import { AUTH_COOKIE_NAME } from "./cookiename.ts";

const authCookieTemplate: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	path: "/",
};

export class AuthController {
	#authService: AuthService;
	#router: Router;

	constructor(authService: AuthService) {
		this.#authService = authService;
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
			res.cookie(AUTH_COOKIE_NAME, token.token, {
				...authCookieTemplate,
				expires: nowInMonths(1),
			});
			res.redirect(303, "/");
		});

		this.#router.post("/logout", async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const token = req.cookies[AUTH_COOKIE_NAME];
			if (!token) {
				throw new ErrBadInput("logout with no token");
			}
			await this.#authService.logout(token);
			res.clearCookie(AUTH_COOKIE_NAME, {
				...authCookieTemplate,
			});
			res.redirect(303, "/login");
		});
	}

	router(): Router {
		return this.#router;
	}
}

function nowInMonths(months: number): Date {
	const date = new Date();
	date.setMonth(date.getMonth() + months);
	return date;
}
