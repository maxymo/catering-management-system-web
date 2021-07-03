import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Shop } from '../shop.model';
import { ShopService } from '../shop.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css'],
})
export class ShopListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Shop[] = [];
  isLoading = false;
  shopListener: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;

  currentPage = 1;

  constructor(public shopService: ShopService, private router: Router) {}

  ngOnInit(): void {
    this.loadShops();

    this.shopListener = this.shopService
      .getShopUpdateListener()
      .subscribe((shopData) => {
        this.datasource = shopData.shops;
        this.totalItems = shopData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.shopListener.unsubscribe();
  }

  loadShops() {
    this.isLoading = true;
    this.shopService.getShops(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadShops();
  }

  delete(id: string) {
    this.shopService.deleteShop(id).subscribe((_) => {
      this.loadShops();
    });
  }

  newItem() {
    this.router.navigate(['/shops/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/shops/edit/${id}`]);
  }
}
