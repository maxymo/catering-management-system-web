import { MenuLine } from "./menu.line.model";

export class OrderDto {
  constructor(
    public _id: string = _id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public date: Date = date,
    public menu: MenuLine[] = menu ?? new MenuLine[0],
    public readonly: boolean = readonly ?? false) {}
}