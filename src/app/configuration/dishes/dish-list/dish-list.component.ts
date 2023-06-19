import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Dish } from '../dish.model';
import { DishService } from '../dish.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
})
export class DishListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'portions', displayName: 'Portions' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Dish[] = [];
  isLoading = false;
  dishListener!: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;

  currentPage = 1;

  constructor(public dishService: DishService, private router: Router) {}

  ngOnInit(): void {
    this.loadDishes();

    this.dishListener = this.dishService
      .getDishUpdateListener()
      .subscribe((dishData) => {
        this.datasource = dishData.dishes;
        this.totalItems = dishData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.dishListener.unsubscribe();
  }

  loadDishes() {
    this.isLoading = true;
    this.dishService.getDishes(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadDishes();
  }

  delete(id: string) {
    this.dishService.deleteDish(id).subscribe((_) => {
      this.loadDishes();
    });
  }

  newItem() {
    this.router.navigate(['/dishes/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/dishes/edit/${id}`]);
  }
}
