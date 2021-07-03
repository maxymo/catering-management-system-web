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
  @Output() onDeleteItem: EventEmitter<any> = new EventEmitter();
  @Output() onNewItem: EventEmitter<any> = new EventEmitter();
  @Output() onEditItem: EventEmitter<any> = new EventEmitter();
  @Output() onPageChanged: EventEmitter<PageEvent> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayedColumnsWithActions = this.columnsToDisplay
      .map((r) => r.name)
      .concat(['actions']);
  }

  deleteItem(id: string) {
    this.onDeleteItem.emit(id);
  }

  newItem() {
    this.onNewItem.emit();
  }

  editItem(id: string) {
    this.onEditItem.emit(id);
  }

  pageChanged(event: PageEvent) {
    this.onPageChanged.emit(event);
  }

  openDeleteConfirmation(id: string, name: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { itemToDeleteName: name, answer: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteItem.emit(id);
      }
    });
  }
}
