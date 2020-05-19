import { Component, OnInit } from '@angular/core';
import { UnitModel } from '../models/unit.model';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css'],
})
export class UnitListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: UnitModel[] = [
    { name: 'Kg ', description: 'test' },
    { name: 'gr', description: 'test' },
    { name: 'Bunch', description: 'test' },
    { name: 'Liter', description: 'test' },
  ];
  constructor() {}

  ngOnInit(): void {}
}
