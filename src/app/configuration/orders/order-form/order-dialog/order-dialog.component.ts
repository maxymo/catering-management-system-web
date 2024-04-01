import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuLine } from '../../menu.line.model';
import { OrderFormComponent } from '../order-form.component';

@Component({
  selector: 'app-order-dialog',
  templateUrl: 'order-dialog.component.html',
})
export class OrderDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuLine) {
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
