import express, { type CookieOptions, type Router, type Response } from "express";
import { ErrInvalidCredentials, type AuthService } from "./service.ts";
import { ErrBadInput, mustString } from "../helpers/conversions.ts";
import type { CookieHelper } from "../helpers/cookieHelper.ts";
import { AUTH_COOKIE_KEY } from "./cookiekey.ts";
import { ErrPerm } from "../middlewares/errors.ts";
import { userFromRequest } from "../middlewares/auth.ts";

export class AuthController {
	#authService: AuthService;
	#router: Router;
	#authCookieTemplate: CookieOptions;
	#authCookieName: string;

	constructor(authService: AuthService, cookieHelper: CookieHelper) {
		this.#authService = authService;
		this.#router = express.Router();
		this.#authCookieTemplate = cookieHelper.cookieTemplate();
		this.#authCookieName = cookieHelper.cookieName(AUTH_COOKIE_KEY);
		this.registerRoutes();
	}

	private registerRoutes() {
		this.#router.post("/login", express.json(), async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const email = mustString(req.body.email);
			const password = mustString(req.body.password);
			try {
				const { user, authToken } = await this.#authService.login(email, password);
				res.cookie(this.#authCookieName, authToken.token, {
					...this.#authCookieTemplate,
					expires: nowInMonths(1),
				});
				res.send(user);
			} catch (err) {
				if (err instanceof ErrInvalidCredentials) {
					res.sendStatus(401);
					return;
				}
				if (err instanceof ErrPerm) {
					res.sendStatus(403); // legal creds, but we prevent login
					return;
				}
				throw err;
			}
		});

		this.#router.post("/logout", async (req, res) => {
			const token = req.cookies[this.#authCookieName];
			if (!token) {
				throw new ErrBadInput("logout with no token");
			}
			try {
				await this.#authService.logout(token);
			} catch (err) {
				console.log(err);
			}
			res.clearCookie(this.#authCookieName, {
				...this.#authCookieTemplate,
			});
			res.sendStatus(200);
		});

		this.#router.get("/self", async (req, res) => {
			try {
				const user = userFromRequest(req);
				res.send(user);
				return;
			} catch (_err) {
				res.sendStatus(404);
			}
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
