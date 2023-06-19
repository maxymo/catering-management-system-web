export class DishIngredient {
  constructor(
    public name: string = name ?? '',
    public unitName: string = unitName ?? '',
    public quantity: number = quantity ?? 0
  ) {}
}
