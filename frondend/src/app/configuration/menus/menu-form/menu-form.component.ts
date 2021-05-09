import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MenuIngredient } from '../menu.ingredient.model';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  masterForm: FormGroup;
  detailForm: FormGroup;
  mode: string = 'create';
  menu: Menu;
  isLoading = false;
  displayedColumns: string[] = ['name', 'quantity', 'unitName', 'actions'];
  dataSource = null;

  constructor(
    public menuService: MenuService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.masterForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(),
      portions: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(Number.MAX_VALUE)]
      }),
    });
    this.detailForm = new FormGroup({
      ingredients: this.fb.array([]),
    }),

    ///ingredients: this.fb.array([MenuIngredient]),
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.menuService.getMenu(id).subscribe((result) => {
          this.menu = result.data;
          console.log(this.menu);
          this.masterForm.patchValue({
            name: this.menu.name,
            description: this.menu.description,
            portions: this.menu.portions,
          });
          if (this.menu.ingredients != null){
            this.menu.ingredients.forEach(ingredient => {
              this.addIngredient(ingredient.name, ingredient.unitName, ingredient.quantity)
            });
          }
          // this.detailForm.setValue({
          //   ingredients: this.menu.ingredients,
          // });
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

  addIngredient(name: string, unitName: string, quantity: number){
    const ingredientForm = this.fb.group({
      name: [name, Validators.required],
      unitName: [unitName, Validators.required],
      quantity: [quantity, Validators.required]
    });

    this.ingredients.push(ingredientForm);
  }
  deleteIngredient(ingredientIndex: number) {
    this.ingredients.removeAt(ingredientIndex);
  }

  get ingredients(): FormArray {
    return this.detailForm.get('ingredients') as FormArray;
  }

  openDialog(element: MenuIngredient): void {
    const dialogRef = this.dialog.open(IngredientDialogComponent, {
      width: '250px',
      data: Object.assign({}, element)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(element);
      console.log(result);
      element = result;
      console.log(element);
    });
  }

  onSave() {
    if (!this.masterForm.valid) {
      return;
    }
    console.log(this.detailForm.value.ingredients);
    const menuToSave: Menu = {
      id: null,
      name: this.masterForm.value.name,
      description: this.masterForm.value.description,
      readonly: false,
      portions: this.masterForm.value.portions,
      ingredients: this.detailForm.value.ingredients,
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
