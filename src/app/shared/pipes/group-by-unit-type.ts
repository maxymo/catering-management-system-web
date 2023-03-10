import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '../../configuration/units/unit.model';

@Pipe({name: 'groupByUnitType'})
export class GroupByPipe implements PipeTransform {
    transform(collection: Array<Unit> | null, property: string = 'type'): Array<any> | null {
        if (collection == null) {
            return null;
        }
        const gc = collection.reduce((previous, current) => {
            if (!previous[current[property]]) {
                previous[current[property]] = [];
            }

            previous[current[property]].push({ name: current.name });
            previous[current[property]].sort((a, b) => a.name > b.name ? 1 : -1);
            return previous;
        }, {});
        return Object.keys(gc)
          .map(type => ({ type, units: gc[type] }))
          .sort((a, b) => a.type > b.type ? 1 : -1);
    }
}
