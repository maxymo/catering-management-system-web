import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Menu } from '../menu.model';
import { MenuService } from '../menu.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    { name: 'name', displayName: 'Name' },
    { name: 'portions', displayName: 'Portions' },
    { name: 'description', displayName: 'Description' },
  ];
  datasource: Menu[] = [];
  isLoading = false;
  menuListener: Subscription;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;

  currentPage = 1;

  constructor(public menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.loadMenus();

    this.menuListener = this.menuService
      .getMenuUpdateListener()
      .subscribe((menuData) => {
        this.datasource = menuData.menus;
        this.totalItems = menuData.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.menuListener.unsubscribe();
  }

  loadMenus() {
    this.isLoading = true;
    this.menuService.getMenus(this.pageSize, this.currentPage);
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMenus();
  }

  delete(id: string) {
    this.menuService.deleteMenu(id).subscribe((_) => {
      this.loadMenus();
    });
  }

  newItem() {
    this.router.navigate(['/menus/create']);
  }

  editItem(id: string) {
    this.router.navigate([`/menus/edit/${id}`]);
  }
}
