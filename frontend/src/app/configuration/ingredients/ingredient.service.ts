import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';

import { Ingredient } from './ingredient.model';
import { environment } from '../../../environments/environment';
import {IngredientDto} from "./ingredient.dto";

const BACKEND_URL = environment.apiUrl + 'ingredients/';

@Injectable({ providedIn: 'root' })
export class IngredientService {
  ingredients: Ingredient[] = [];

  private ingredientsUpdated = new Subject<{ ingredients: Ingredient[]; count: number }>();

  constructor(private http: HttpClient) {}

  getIngredients(pageSize: number, curentPage: number) {
    this.http
      .get<{ data: IngredientDto[]; count: number }>(
        `${BACKEND_URL}?currentPage=${curentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((ingredientData : { count: number, data: IngredientDto[]}) => {
          return {
            ingredients: ingredientData.data.map((ingredient : IngredientDto) => {
              return new Ingredient(
                ingredient._id,
                ingredient.name,
                ingredient.shopName ?? "",
                ingredient.description ?? "",
                ingredient.defaultUnitWhenBuying ?? "",
                ingredient.defaultUnitWhenUsing ?? "",
                ingredient.readonly ?? false);
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
        data: IngredientDto;
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((ingredient: {data : IngredientDto}) => {
          return {
            data: {
              id: ingredient.data._id,
              name: ingredient.data.name,
              shopName: ingredient.data.shopName,
              description: ingredient.data.description,
              defaultUnitWhenUsing: ingredient.data.defaultUnitWhenUsing,
              defaultUnitWhenBuying: ingredient.data.defaultUnitWhenBuying,
              readonly: ingredient.data.readonly,
            },
          };
        })
      );
  }
}
