import { MenuIngredient } from './menu.ingredient.model';

export class Menu {

  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public readonly: boolean = readonly ?? false,
    public portions: number = portions ?? 0,
    public ingredients: MenuIngredient[] = ingredients ?? MenuIngredient[0],
  ) {}
}
