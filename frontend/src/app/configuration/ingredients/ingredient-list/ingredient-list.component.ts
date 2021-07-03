import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Ingredient } from '../ingredient.model';
import { IngredientService } from '../ingredient.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css'],
})
export class IngredientListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'shopName', displayName: 'Shop Name' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Ingredient[] = [];
  isLoading = false;
  ingredientListener: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;

  currentPage = 1;

  constructor(public ingredientService: IngredientService, private router: Router) {}

  ngOnInit(): void {
    this.loadIngredients();

    this.ingredientListener = this.ingredientService
      .getIngredientUpdateListener()
      .subscribe((ingredientData) => {
        this.datasource = ingredientData.ingredients;
        this.totalItems = ingredientData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.ingredientListener.unsubscribe();
  }

  loadIngredients() {
    this.isLoading = true;
    this.ingredientService.getIngredients(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadIngredients();
  }

  delete(id: string) {
    this.ingredientService.deleteIngredient(id).subscribe((_) => {
      this.loadIngredients();
    });
  }

  newItem() {
    this.router.navigate(['/ingredients/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/ingredients/edit/${id}`]);
  }
}
