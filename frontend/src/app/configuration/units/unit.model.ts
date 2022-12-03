export class Unit {
  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public type: string = type ?? '',
    public readonly: boolean = readonly ?? false) {
    // 
  }
}
