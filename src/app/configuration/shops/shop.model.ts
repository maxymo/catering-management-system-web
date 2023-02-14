export class Shop {
  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public readonly: boolean = readonly ?? false) {}
}
