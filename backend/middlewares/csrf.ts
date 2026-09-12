import { type RequestHandler } from "express";

export function csrfMw(): RequestHandler {
	return (req, _resp) => {
		// Allow same-origin requests
		// Allow directly user-initiated requests (from bookmarks, address bar etc.)
		const secFetchSite = req.headers["sec-fetch-site"];
		if (secFetchSite === "same-origin" || secFetchSite === "none") {
			return true;
		}

		// Allow cross-site navigations, such as clicking links
		const secFetchMode = req.headers["sec-fetch-mode"];
		if (secFetchMode === "navigate" && req.method === "GET") {
			return true;
		}

		// Deny everything else
		return false;
	};
}
