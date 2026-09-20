import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors, withNoXsrfProtection } from "@angular/common/http";
import { authFailureInterceptor } from "./auth/auth-failure-interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes, withComponentInputBinding({ queryParams: false })),
		provideHttpClient(withNoXsrfProtection(), withInterceptors([authFailureInterceptor])),
	],
};
