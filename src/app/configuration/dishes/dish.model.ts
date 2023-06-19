import { DishIngredient } from './dish.ingredient.model';

export class Dish {

  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public readonly: boolean = readonly ?? false,
    public portions: number = portions ?? 0,
    public ingredients: DishIngredient[] = ingredients ?? DishIngredient[0],
  ) {}
}
