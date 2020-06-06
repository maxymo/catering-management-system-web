import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Unit } from '../unit.model';
import { UnitService } from '../unit.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css'],
})
export class UnitListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Unit[] = [];
  isLoading = false;
  unitListener: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 3, 5, 10];
  currentPage = 1;

  constructor(public unitService: UnitService, private router: Router) {}

  ngOnInit(): void {
    this.loadUnits();

    this.unitListener = this.unitService
      .getUnitUpdateListener()
      .subscribe((unitData) => {
        this.datasource = unitData.units;
        this.totalItems = unitData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.unitListener.unsubscribe();
  }

  loadUnits() {
    this.isLoading = true;
    this.unitService.getUnits(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUnits();
  }

  delete(id: string) {
    this.unitService.deleteUnit(id).subscribe((_) => {
      this.loadUnits();
    });
  }

  newItem() {
    this.router.navigate(['/units/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/units/edit/${id}`]);
  }
}
