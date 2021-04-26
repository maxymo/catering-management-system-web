import { MenuIngredient } from "./menu.ingredient.model";

export class Menu {
  id: string;
  name: string;
  description: string;
  readonly: boolean;
  portions: number;
  ingredients: [MenuIngredient]
}
