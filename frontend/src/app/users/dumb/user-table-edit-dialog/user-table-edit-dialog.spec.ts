import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTestDialogOpener, MatTestDialogOpenerModule } from "@angular/material/dialog/testing";
import { MatDialogModule } from "@angular/material/dialog";

import { UserTableEditDialog } from "./user-table-edit-dialog";

describe("UserTableEditDialog", () => {
	let component: UserTableEditDialog;
	let fixture: ComponentFixture<MatTestDialogOpener<UserTableEditDialog, any>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserTableEditDialog, MatDialogModule, MatTestDialogOpenerModule],
		}).compileComponents();

		fixture = TestBed.createComponent(
			MatTestDialogOpener.withComponent(UserTableEditDialog, {
				data: {
					id: -1,
					name: "dummy",
					email: "dummy@example.com",
					role: "user",
					disabled: false,
				},
			}),
		);
		component = fixture.componentInstance.dialogRef.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
