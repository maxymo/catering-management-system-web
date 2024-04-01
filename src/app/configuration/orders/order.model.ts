import { MenuLine } from './menu.line.model';

export class Order {

  constructor(
    public id: string = id ?? '',
    public name: string = name ?? '',
    public description: string = description ?? '',
    public readonly: boolean = readonly ?? false,
    public date: Date = date,
    public menu: MenuLine[] = menu ?? MenuLine[0],
  ) {}
}
