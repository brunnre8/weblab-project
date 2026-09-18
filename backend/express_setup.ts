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
import { AuthController } from "./auth/controller.ts";
import { AuthService } from "./auth/service.ts";
import type { AuthTokenStore } from "./auth/tokenStore.ts";

export function createExpressApp(store: TodoStore & UserStore, tokenStore: AuthTokenStore): Express {
	const app = express();
	app.disable("x-powered-by");

	const userService = new UserService(store);

	const apiRouter = express.Router();
	apiRouter.use(cookieParser());
	apiRouter.use(authMw());
	apiRouter.use("/todos", new TodoController(new TodoService(store)).router());
	apiRouter.use("/users", adminOnlyMw(), new UserController(userService).router());

	app.use(csrfMw());

	app.use("/api", apiRouter);
	app.use("/auth", new AuthController(new AuthService(userService, tokenStore)).router());

	// error handlers need to be after all routes are registered
	app.use(permissionErrorMw());
	app.use(noEntityErrorMw());
	app.use(badInputErrorMw());
	app.use(conflictErrorMw());
	app.use(internalErrorMw()); // keep this last
	return app;
}
