import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authFailureInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	return next(req).pipe(
		catchError((err: HttpErrorResponse) => {
			if (!err.url?.startsWith(window.location.origin) && !err.url?.startsWith("/")) {
				// not our backend
				return throwError(() => err);
			}
			if (err.url?.includes("/auth/login")) {
				// can't do anything then
				return throwError(() => err);
			}
			if (err.status !== 401) {
				// only want to react to auth errors
				return throwError(() => err);
			}
			router.navigateByUrl("/login");
			return throwError(() => err);
		}),
	);
};
