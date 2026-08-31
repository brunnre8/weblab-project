import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Hello } from "./hello";

describe("Hello", () => {
	let component: Hello;
	let fixture: ComponentFixture<Hello>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Hello],
		}).compileComponents();

		fixture = TestBed.createComponent(Hello);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	// it("should render title", async () => {
	// 	const fixture = TestBed.createComponent(Hello);
	// 	await fixture.whenStable();
	// 	const compiled = fixture.nativeElement as HTMLElement;
	// 	expect(compiled.querySelector("h1")?.textContent).toContain("Hello, playground");
	// });
});
