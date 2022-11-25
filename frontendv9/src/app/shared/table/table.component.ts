import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() columnsToDisplay: [{ name: string; displayName: string }];
  displayedColumnsWithActions: string[];

  @Input() dataSource: [{}];
  @Input() title: string;
  @Input() totalItems: number;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  @Output() deleteItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() newItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() editItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() pageChangedEvent: EventEmitter<PageEvent> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayedColumnsWithActions = this.columnsToDisplay
      .map((r) => r.name)
      .concat(['actions']);
  }

  deleteItem(id: string) {
    this.deleteItemEvent.emit(id);
  }

  newItem() {
    this.newItemEvent.emit();
  }

  editItem(id: string) {
    this.editItemEvent.emit(id);
  }

  pageChanged(event: PageEvent) {
    this.pageChangedEvent.emit(event);
  }

  openDeleteConfirmation(id: string, name: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { itemToDeleteName: name, answer: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteItemEvent.emit(id);
      }
    });
  }
}
