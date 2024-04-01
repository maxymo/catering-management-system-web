import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Order } from './order.model';
import { environment } from '../../../environments/environment';
import { OrderDto } from "./order.dto";

const BACKEND_URL = environment.apiUrl + 'orders/';

@Injectable({ providedIn: 'root' })
export class OrderService {
  orders: Order[] = [];

  private ordersUpdated = new Subject<{ orders: Order[]; count: number }>();

  constructor(private http: HttpClient) {}

  getOrders(pageSize: number, currentPage: number) {
    this.http
      .get<{ data: OrderDto[]; count: number }>(
        `${BACKEND_URL}?currentPage=${currentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((orderData : { count: number, data: OrderDto[]}) => {
          return {
            orders: orderData.data.map((order) => {
              return new Order(
                order._id,
                order.name,
                order.description,
                order.readonly,
                order.date,
                order.menu);
            }),
            count: orderData.count,
          };
        })
      )
      .subscribe((transformedOrdersData) => {
        this.orders = transformedOrdersData.orders;
        this.ordersUpdated.next({
          orders: [...this.orders],
          count: transformedOrdersData.count,
        });
      });
  }

  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  addOrder(order: Order) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, order);
  }

  updateOrder(order: Order) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${order.id}`, order);
  }

  deleteOrder(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getOrder(id: string) {
    return this.http
      .get<{
        data: OrderDto;
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((orderData: {data: OrderDto}) => {
          return {
            data: {
              id: orderData.data._id,
              name: orderData.data.name,
              description: orderData.data.description,
              readonly: orderData.data.readonly,
              date: orderData.data.date,
              menu: orderData.data.menu,
            },
          };
        })
      );
  }
}
