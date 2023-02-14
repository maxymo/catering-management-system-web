import {Ingredient} from "../ingredients/ingredient.model";
import {MenuIngredient} from "./menu.ingredient.model";

export class MenuDto {
  constructor(
    public _id: string = _id ?? '',
    public name: string = name ?? '',
    public shopName: string = shopName ?? '',
    public description: string = description ?? '',
    public portions: number = portions ?? 0,
    public ingredients: MenuIngredient[] = ingredients ?? new MenuIngredient[0],
    public readonly: boolean = readonly ?? false) {}
}
