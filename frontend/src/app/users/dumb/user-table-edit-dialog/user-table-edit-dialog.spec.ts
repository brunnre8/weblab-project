import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserTableEditDialog } from "./user-table-edit-dialog";

describe("UserTableEditDialog", () => {
	let component: UserTableEditDialog;
	let fixture: ComponentFixture<UserTableEditDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserTableEditDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(UserTableEditDialog);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
