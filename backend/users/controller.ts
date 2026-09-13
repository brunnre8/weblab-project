import express, { type Router } from "express";
import type { UserService } from "./service.ts";
import { ErrBadInput, mustString, safeInt } from "../helpers/conversions.ts";
import { type UserID } from "./models.ts";

export class UserController {
	#userService: UserService;
	#router: Router;

	constructor(userService: UserService) {
		this.#userService = userService;
		this.#router = express.Router();
		this.registerRoutes();
	}

	private registerRoutes() {
		// read
		this.#router.get("/", async (_req, res) => {
			const users = await this.#userService.listUsers();
			res.json(users);
		});

		// create
		this.#router.post("/new", express.json(), async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const password = mustString(req.body.password);
			const user = await this.#userService.insertUser(req.body.user, password);
			res.status(201);
			res.json(user);
		});

		// update
		this.#router.put("/:id", express.json(), async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const userID: UserID = safeInt(req.params.id);
			await this.#userService.updateUser(userID, req.body);
			res.sendStatus(200);
		});

		// delete
		this.#router.delete("/:id", async (req, res) => {
			const userID: UserID = safeInt(req.params.id);
			await this.#userService.deleteUser(userID);
			res.sendStatus(200);
		});
	}

	// expects to be mounted at $root/users
	router(): Router {
		return this.#router;
	}
}
