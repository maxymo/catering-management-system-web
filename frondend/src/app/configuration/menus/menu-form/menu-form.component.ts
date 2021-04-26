import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
// import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';
import { MenuIngredient } from '../menu.ingredient.model';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  form: FormGroup;
  mode: string = 'create';
  menu: Menu;
  isLoading = false;
  displayedColumns: string[] = ['name', 'quantity', 'unitName', 'actions'];
  dataSource = null;
  animal: string;
  name: string;

  constructor(
    public menuService: MenuService,
    public router: Router,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(),
      portions: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(Number.MAX_VALUE)]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.menuService.getMenu(id).subscribe((result) => {
          this.menu = result.data;
          console.log(this.menu);
          this.form.setValue({
            name: this.menu.name,
            description: this.menu.description,
            portions: this.menu.portions,
          });
          this.dataSource = this.menu.ingredients;
          this.isLoading = false;
        });
      } else {
        this.menu = {
          id: null,
          name: '',
          description: '',
          readonly: false,
          portions: 0,
          ingredients: null
        };
        this.isLoading = false;
      }
    });
  }

  // openDialog(element: MenuIngredient): void {
  //   const dialogRef = this.dialog.open(IngredientDialogComponent, {
  //     width: '250px',
  //     data: element
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    const menuToSave: Menu = {
      id: null,
      name: this.form.value.name,
      description: this.form.value.description,
      readonly: false,
      portions: this.form.value.portions,
      ingredients: null
    };

    this.isLoading = true;
    if (this.mode === 'create') {
      this.menuService
        .addMenu(menuToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/menus']);
          } else {
            this.isLoading = false;
          }
        });
    } else {
      menuToSave.id = this.menu.id;
      this.menuService
        .updateMenu(menuToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.message) {
            this.router.navigate(['/menus']);
          } else {
            this.isLoading = false;
          }
        });
    }
  }

  editItem(){

  }
}
