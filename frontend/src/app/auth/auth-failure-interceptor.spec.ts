import { TestBed } from "@angular/core/testing";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { authFailureInterceptor } from "./auth-failure-interceptor";

describe("authFailureInterceptorInterceptor", () => {
	let router: Router;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(withInterceptors([authFailureInterceptor])), provideHttpClientTesting()],
		});
		router = TestBed.inject(Router);
	});

	it("should redirect", () => {
		const spy = vi.spyOn(router, "navigateByUrl");
		const httpTesting = TestBed.inject(HttpTestingController);
		const http = TestBed.inject(HttpClient);
		http.get("/api/").subscribe({
			error() {},
		});
		const req = httpTesting.expectOne({ method: "GET" });
		req.flush("", { status: 401, statusText: "unauthorized" });
		TestBed.tick();
		expect(spy).toHaveBeenCalledWith("/login");
	});
});
