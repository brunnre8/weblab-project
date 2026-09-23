import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserTableNewDialog } from "./user-table-new-dialog";
import { MatTestDialogOpener, MatTestDialogOpenerModule } from "@angular/material/dialog/testing";
import { MatDialogModule } from "@angular/material/dialog";

describe("UserTableNewDialog", () => {
	let component: UserTableNewDialog;
	let fixture: ComponentFixture<MatTestDialogOpener<UserTableNewDialog, any>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserTableNewDialog, MatDialogModule, MatTestDialogOpenerModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MatTestDialogOpener.withComponent(UserTableNewDialog, {}));
		component = fixture.componentInstance.dialogRef.componentInstance;
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
