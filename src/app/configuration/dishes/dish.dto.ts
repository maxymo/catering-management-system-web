import {Ingredient} from "../ingredients/ingredient.model";
import {DishIngredient} from "./dish.ingredient.model";

export class DishDto {
  constructor(
    public _id: string = _id ?? '',
    public name: string = name ?? '',
    public shopName: string = shopName ?? '',
    public description: string = description ?? '',
    public portions: number = portions ?? 0,
    public ingredients: DishIngredient[] = ingredients ?? new DishIngredient[0],
    public readonly: boolean = readonly ?? false) {}
}
