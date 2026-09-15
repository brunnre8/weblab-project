import express, { type Express } from "express";
import { adminOnlyMw, authMw } from "./middlewares/auth.ts";
import {
	permissionErrorMw,
	noEntityErrorMw,
	badInputErrorMw,
	internalErrorMw,
	conflictErrorMw,
} from "./middlewares/errors.ts";
import { TodoController } from "./todos/controller.ts";
import { TodoService } from "./todos/service.ts";
import type { TodoStore } from "./todos/todoStore.ts";
import type { UserStore } from "./users/userStore.ts";
import { UserController } from "./users/controller.ts";
import { UserService } from "./users/service.ts";
import { csrfMw } from "./middlewares/csrf.ts";
import cookieParser from "cookie-parser";

export function createExpressApp(store: TodoStore & UserStore): Express {
	const app = express();
	app.disable("x-powered-by");

	const apiRouter = express.Router();
	apiRouter.use(cookieParser());
	apiRouter.use(csrfMw());
	apiRouter.use(authMw());
	apiRouter.use("/todos", new TodoController(new TodoService(store)).router());
	apiRouter.use("/users", adminOnlyMw(), new UserController(new UserService(store)).router());

	app.use("/api", apiRouter);

	// error handlers need to be after all routes are registered
	app.use(permissionErrorMw());
	app.use(noEntityErrorMw());
	app.use(badInputErrorMw());
	app.use(conflictErrorMw());
	app.use(internalErrorMw()); // keep this last
	return app;
}
