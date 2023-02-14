import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Menu } from './menu.model';
import { environment } from '../../../environments/environment';
import {MenuDto} from "./menu.dto";
import {IngredientDto} from "../ingredients/ingredient.dto";

const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class MenuService {
  menus: Menu[] = [];

  private menusUpdated = new Subject<{ menus: Menu[]; count: number }>();

  constructor(private http: HttpClient) {}

  getMenus(pageSize: number, currentPage: number) {
    this.http
      .get<{ data: MenuDto[]; count: number }>(
        `${BACKEND_URL}?currentPage=${currentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((menuData : { count: number, data: MenuDto[]}) => {
          return {
            menus: menuData.data.map((menu) => {
              return new Menu(
                menu._id,
                menu.name,
                menu.description,
                menu.readonly,
                menu.portions,
                menu.ingredients);
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
        data: MenuDto;
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((menuData: {data: MenuDto}) => {
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
