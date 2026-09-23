import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserTableNewDialog } from "./user-table-new-dialog";

describe("UserTableNewDialog", () => {
	let component: UserTableNewDialog;
	let fixture: ComponentFixture<UserTableNewDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserTableNewDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(UserTableNewDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
