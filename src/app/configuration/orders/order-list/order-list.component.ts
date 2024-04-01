import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Order } from '../order.model';
import { OrderService } from '../order.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'date', displayName: 'Date' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Order[] = [];
  isLoading = false;
  orderListener!: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;

  currentPage = 1;

  constructor(public orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();

    this.orderListener = this.orderService
      .getOrderUpdateListener()
      .subscribe((orderData) => {
        this.datasource = orderData.orders;
        this.totalItems = orderData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.orderListener.unsubscribe();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  delete(id: string) {
    this.orderService.deleteOrder(id).subscribe((_) => {
      this.loadOrders();
    });
  }

  newItem() {
    this.router.navigate(['/orders/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/orders/edit/${id}`]);
  }
}