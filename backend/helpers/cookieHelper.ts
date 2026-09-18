import type { CookieOptions } from "express";

export class CookieHelper {
	#insecure: boolean;

	constructor(insecure: boolean) {
		this.#insecure = insecure;
	}

	cookieName(name: string): string {
		if (this.#insecure) {
			return `Http-${name}`;
		}
		return `__Host-Http-${name}`;
	}

	cookieTemplate(): CookieOptions {
		return {
			httpOnly: true,
			secure: !this.#insecure,
			sameSite: "strict",
			path: "/",
		};
	}
}
