import express, { type Router } from "express";
import type { TodoService } from "./service.ts";
import { userFromRequest } from "../middlewares/auth.ts";
import { ErrBadInput, safeInt } from "../helpers/conversions.ts";
import { verifyTodoInput, type TodoID } from "./models.ts";

export class TodoController {
	#todoService: TodoService;
	#router: Router;

	constructor(todoStore: TodoService) {
		this.#todoService = todoStore;
		this.#router = express.Router();
		this.registerRoutes();
	}

	private registerRoutes() {
		// read
		this.#router.get("/", (req, res) => {
			const user = userFromRequest(req);
			const todos = this.#todoService.listTodos(user.id);
			res.json(todos);
		});

		// create
		this.#router.post("/new", express.json(), async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const input = verifyTodoInput(req.body);
			const user = userFromRequest(req);
			const todo = await this.#todoService.insertTodo(input, user);
			res.status(201);
			res.send(todo);
		});

		// update
		this.#router.put("/:id", express.json(), async (req, res) => {
			if (!req.body) {
				throw new ErrBadInput("expected json body");
			}
			const user = userFromRequest(req);
			const todoID: TodoID = safeInt(req.params.id);
			const updates = verifyTodoInput(req.body);
			await this.#todoService.updateTodo(todoID, updates, user);
			res.sendStatus(200);
		});
	}

	// expects to be mounted at $root/todos/
	router(): Router {
		return this.#router;
	}
}
