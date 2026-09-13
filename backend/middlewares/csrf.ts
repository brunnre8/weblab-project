import { type RequestHandler } from "express";

export function csrfMw(): RequestHandler {
	return (req, resp, next) => {
		// Allow same-origin requests
		// Allow directly user-initiated requests (from bookmarks, address bar etc.)
		const secFetchSite = req.headers["sec-fetch-site"];
		if (secFetchSite === "same-origin" || secFetchSite === "none") {
			next();
			return;
		}

		// Allow cross-site navigations, such as clicking links
		const secFetchMode = req.headers["sec-fetch-mode"];
		if (secFetchMode === "navigate" && req.method === "GET") {
			next();
			return;
		}

		// Deny everything else
		resp.status(401);
		resp.contentType("text/plain");
		resp.send("CSRF protection kicked in");
	};
}
