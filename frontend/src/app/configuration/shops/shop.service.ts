import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';

import { Shop } from './shop.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'shops/';

@Injectable({ providedIn: 'root' })
export class ShopService {
  shops: Shop[] = [];
  shopNames: string[] = [];

  private shopsUpdated = new Subject<{ shops: Shop[]; count: number }>();
  private shopNamesUpdated = new Subject<{ shopNames: string[]; count: number }>();

  constructor(private http: HttpClient) {}

  getShops(pageSize: number, curentPage: number) {
    this.http
      .get<{ data: any; count: number }>(
        `${BACKEND_URL}?currentPage=${curentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((shopData) => {
          return {
            shops: shopData.data.map((shop: { _id: any; name: any; description: any; readonly: any; }) => {
              return {
                id: shop._id,
                name: shop.name,
                description: shop.description,
                readonly: shop.readonly,
              };
            }),
            count: shopData.count,
          };
        })
      )
      .subscribe((transformedShopsData) => {
        this.shops = transformedShopsData.shops;
        this.shopsUpdated.next({
          shops: [...this.shops],
          count: transformedShopsData.count,
        });
      });
  }

  getShopNames() {
    return this.http
      .get<{ data: { shopName: string }[], count: number }>(
        `${BACKEND_URL}/names`
      )
      .pipe(
        map((shopData) => {
          return {
            shopNames: shopData.data.map((shop : { shopName: string}) => {
              return {
                name: shop.shopName,
              };
            }),
            count: shopData.count,
          };
        })
      );
  }

  getShopUpdateListener() {
    return this.shopsUpdated.asObservable();
  }

  addShop(shop: Shop) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, shop);
  }

  updateShop(shop: Shop) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${shop.id}`, shop);
  }

  deleteShop(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getShop(id: string) {
    return this.http
      .get<{
        data: {
          _id: string;
          name: string;
          description: string;
          readonly: boolean;
        };
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((shopData) => {
          return {
            data: {
              id: shopData.data._id,
              name: shopData.data.name,
              description: shopData.data.description,
              readonly: shopData.data.readonly,
            },
          };
        })
      );
  }
}
