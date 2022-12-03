import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';

import { Unit } from './unit.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'units/';

@Injectable({ providedIn: 'root' })
export class UnitService {
  units: Unit[] = [];

  private unitsUpdated = new Subject<{ units: Unit[]; count: number }>();

  constructor(private http: HttpClient) { }

  getUnits(pageSize: number, curentPage: number) {
    this.http
      .get<{ data: any; count: number }>(
        `${BACKEND_URL}?currentPage=${curentPage}&pageSize=${pageSize}`
      )
      .pipe(
        map((unitData) => {
          return {
            units: unitData.data.map((unit: { _id: any; name: any; description: any; type: any; readonly: any; }) => {
              return {
                id: unit._id,
                name: unit.name,
                description: unit.description,
                type: unit.type,
                readonly: unit.readonly,
              };
            }),
            count: unitData.count,
          };
        })
      )
      .subscribe((transformedUnitsData) => {
        this.units = transformedUnitsData.units;
        this.unitsUpdated.next({
          units: [...this.units],
          count: transformedUnitsData.count,
        });
      });
  }

  getUnitsForDropDownList() {
    this.http
      .get<{ data: any; count: number }>(
        `${BACKEND_URL}?currentPage=${0}&pageSize=${9999999}`
      )
      .pipe(
        map((unitData) => {
          return {
            units: unitData.data.map((unit: { _id: any; name: any; description: any; type: any; readonly: any; }) => {
              return {
                id: unit._id,
                name: unit.name,
                description: unit.description,
                type: unit.type,
                readonly: unit.readonly,
              };
            }),
            count: unitData.count,
          };
        })
      )
      .subscribe((transformedUnitsData) => {
        this.units = transformedUnitsData.units;
        this.unitsUpdated.next({
          units: [...this.units],
          count: transformedUnitsData.count,
        });
      });
  }

  getUnitUpdateListener() {
    return this.unitsUpdated.asObservable();
  }

  addUnit(unit: Unit) {
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, unit);
  }

  updateUnit(unit: Unit) {
    return this.http.put<{ message: string }>(`${BACKEND_URL}${unit.id}`, unit);
  }

  deleteUnit(id: string) {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}${id}`);
  }

  getUnit(id: string) {
    return this.http
      .get<{
        data: {
          _id: string;
          name: string;
          description: string;
          type: string;
          readonly: boolean;
        };
      }>(`${BACKEND_URL}${id}`)
      .pipe(
        map((unitData) => {
          return {
            data: {
              id: unitData.data._id,
              name: unitData.data.name,
              description: unitData.data.description,
              type: unitData.data.type,
              readonly: unitData.data.readonly,
            },
          };
        })
      );
  }

  getTypes() {
    return ['Length', 'Mass', 'Volume'];
  }
}
