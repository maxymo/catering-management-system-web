export class Ingredient {
  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public shopName: string = shopName ?? '',
    public description: string = description ?? '',
    public defaultUnitWhenBuying: string = defaultUnitWhenBuying ?? '',
    public defaultUnitWhenUsing: string = defaultUnitWhenUsing ?? '',
    public readonly: boolean = readonly ?? false) {}
}
