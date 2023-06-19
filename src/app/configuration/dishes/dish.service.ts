import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Dish } from './dish.model';
import { environment } from '../../../environments/environment';
import {DishDto as DishDto} from "./dish.dto";
import {IngredientDto} from "../ingredients/ingredient.dto";

const BACKEND_URL = environment.apiUrl + 'dishes/';

@Injectable({ providedIn: 'root' })
export class DishService {
  dishes: Dish[] = [];

  private dishesUpdated = new Subject<{ dishes: Dish[]; count: number }>();

  constructor(private http: HttpClient) {}

  getDishes(pageSize: number, currentPage: number) {
    this.http
      .get<{ data: DishDto[]; count: number }>(
        `${BACKEND_URL}?currentPage=${currentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((dishData : { count: number, data: DishDto[]}) => {
          return {
            dishes: dishData.data.map((dish) => {
              return new Dish(
                dish._id,
                dish.name,
                dish.description,
                dish.readonly,
                dish.portions,
                dish.ingredients);
            }),
            count: dishData.count,
          };
        })
      )
      .subscribe((transformedDishesData) => {
        this.dishes = transformedDishesData.dishes;
        this.dishesUpdated.next({
          dishes: [...this.dishes],
          count: transformedDishesData.count,
        });
      });
  }

  getDishUpdateListener() {
    return this.dishesUpdated.asObservable();
  }

  addDish(dish: Dish) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, dish);
  }

  updateDish(dish: Dish) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${dish.id}`, dish);
  }

  deleteDish(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getDish(id: string) {
    return this.http
      .get<{
        data: DishDto;
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((dishData: {data: DishDto}) => {
          return {
            data: {
              id: dishData.data._id,
              name: dishData.data.name,
              description: dishData.data.description,
              readonly: dishData.data.readonly,
              portions: dishData.data.portions,
              ingredients: dishData.data.ingredients,
            },
          };
        })
      );
  }
}
