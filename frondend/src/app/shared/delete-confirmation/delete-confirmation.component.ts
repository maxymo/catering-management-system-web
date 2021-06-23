import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent implements OnInit {
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemToDeleteName: string; answer: boolean }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
