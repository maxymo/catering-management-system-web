import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';

import { Menu } from './menu.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class MenuService {
  menus: Menu[] = [];

  private menusUpdated = new Subject<{ menus: Menu[]; count: number }>();

  constructor(private http: HttpClient) {}

  getMenus(pageSize: number, curentPage: number) {
    this.http
      .get<{ data: any; count: number }>(
        `${BACKEND_URL}?currentPage=${curentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((menuData) => {
          return {
            menus: menuData.data.map((menu) => {
              return {
                id: menu._id,
                name: menu.name,
                description: menu.description,
                readonly: menu.readonly,
                portions: menu.portions,
                ingredients: menu.ingredients,
              };
            }),
            count: menuData.count,
          };
        })
      )
      .subscribe((transformedMenusData) => {
        this.menus = transformedMenusData.menus;
        this.menusUpdated.next({
          menus: [...this.menus],
          count: transformedMenusData.count,
        });
      });
  }

  getMenuUpdateListener() {
    return this.menusUpdated.asObservable();
  }

  addMenu(menu: Menu) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, menu);
  }

  updateMenu(menu: Menu) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${menu.id}`, menu);
  }

  deleteMenu(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getMenu(id: string) {
    return this.http
      .get<{
        data: {
          _id: string;
          name: string;
          description: string;
          readonly: boolean;
          portions: number;
          ingredients: [
            {
              name: string;
              unitName: string;
              quantity: number;
            }
          ]
        };
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((menuData) => {
          return {
            data: {
              id: menuData.data._id,
              name: menuData.data.name,
              description: menuData.data.description,
              readonly: menuData.data.readonly,
              portions: menuData.data.portions,
              ingredients: menuData.data.ingredients,
            },
          };
        })
      );
  }
}
