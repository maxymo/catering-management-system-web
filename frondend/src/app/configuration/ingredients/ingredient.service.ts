import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';

import { Ingredient } from './ingredient.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'ingredients/';

@Injectable({ providedIn: 'root' })
export class IngredientService {
  ingredients: Ingredient[] = [];

  private ingredientsUpdated = new Subject<{ ingredients: Ingredient[]; count: number }>();

  constructor(private http: HttpClient) {}

  getIngredients(pageSize: number, curentPage: number) {
    var count = 0;
    this.http
      .get<{ data: any; count: number }>(
        `${BACKEND_URL}?currentPage=${curentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((ingredientData) => {
          return {
            ingredients: ingredientData.data.map((ingredient) => {
              return {
                id: ingredient._id,
                name: ingredient.name,
                shopName: ingredient.shopName,
                description: ingredient.description,
                defaultUnitWhenBuying: ingredient.defaultUnitWhenBuying,
                defaultUnitWhenUsing: ingredient.defaultUnitWhenUsing,
                readonly: ingredient.readonly,
              };
            }),
            count: ingredientData.count,
          };
        })
      )
      .subscribe((transformedIngredientsData) => {
        this.ingredients = transformedIngredientsData.ingredients;
        this.ingredientsUpdated.next({
          ingredients: [...this.ingredients],
          count: transformedIngredientsData.count,
        });
      });
  }

  getIngredientUpdateListener() {
    return this.ingredientsUpdated.asObservable();
  }

  addIngredient(ingredient: Ingredient) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, ingredient);
  }

  updateIngredient(ingredient: Ingredient) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${ingredient.id}`, ingredient);
  }

  deleteIngredient(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getIngredient(id: string) {
    return this.http
      .get<{
        data: {
          _id: string;
          name: string;
          shopName: string;
          description: string;
          defaultUnitWhenUsing: string;
          defaultUnitWhenBuying: string;
          readonly: boolean;
        };
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((ingredientData) => {
          return {
            data: {
              id: ingredientData.data._id,
              name: ingredientData.data.name,
              shopName: ingredientData.data.shopName,
              description: ingredientData.data.description,
              defaultUnitWhenUsing: ingredientData.data.defaultUnitWhenUsing,
              defaultUnitWhenBuying: ingredientData.data.defaultUnitWhenBuying,
              readonly: ingredientData.data.readonly,
            },
          };
        })
      );
  }
}
