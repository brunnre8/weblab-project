import express, { type Express } from "express";
import { authMw } from "./middlewares/auth.ts";
import { permissionErrorMw, noEntityErrorMw, badInputErrorMw, internalErrorMw } from "./middlewares/errors.ts";
import { TodoController } from "./todos/controller.ts";
import { TodoService } from "./todos/service.ts";
import type { TodoStore } from "./todos/todoStore.ts";
import type { UserStore } from "./users/userStore.ts";

export function createExpressApp(store: TodoStore & UserStore): Express {
	const app = express();
	app.disable("x-powered-by");
	app.use(permissionErrorMw());
	app.use(noEntityErrorMw());
	app.use(badInputErrorMw());
	app.use(internalErrorMw()); // keep this last

	const apiRouter = express.Router();
	apiRouter.use(authMw());
	apiRouter.use("/todos", new TodoController(new TodoService(store)).router());

	app.use("/api", apiRouter);
	return app;
}
