import { TestBed } from "@angular/core/testing";
import { App } from "./app";
import { provideRouter, withComponentInputBinding } from "@angular/router";

describe("App", () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter([], withComponentInputBinding({ queryParams: false }))],
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
