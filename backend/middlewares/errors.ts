import type { ErrorRequestHandler } from "express";
import { ErrBadInput } from "../helpers/conversions.ts";

export class ErrPerm extends Error {}
export class ErrNoEnt extends Error {}

export function permissionErrorMw(): ErrorRequestHandler {
	return (err, _req, res, next) => {
		if (err instanceof ErrPerm) {
			res.sendStatus(404); // don't leak existence to client
			return;
		}
		next(err);
	};
}

export function noEntityErrorMw(): ErrorRequestHandler {
	return (err, _req, res, next) => {
		if (err instanceof ErrNoEnt) {
			res.sendStatus(404);
			return;
		}
		next(err);
	};
}

export function badInputErrorMw(): ErrorRequestHandler {
	return (err, _req, res, next) => {
		if (err instanceof ErrBadInput) {
			res.sendStatus(400);
			return;
		}
		next(err);
	};
}

export function internalErrorMw(): ErrorRequestHandler {
	return (err, _req, res, _next) => {
		console.error(err.stack);
		res.sendStatus(500);
	};
}
