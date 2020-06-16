import { Component, OnInit, OnDestroy } from '@angular/core';

const shopList = [
  { name: 'Makro ' },
  { name: 'Tesco Lotus' },
  { name: 'Big C' },
  { name: 'Market' },
];

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css'],
})
export class ShopListComponent implements OnInit, OnDestroy {
  displayedColumns = [{ name: 'name', displayName: 'Name' }];
  datasource = shopList;
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
