import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
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
  menuForm: FormGroup;
  mode: string = 'create';
  menu: Menu;
  isLoading = false;
  displayColumns: string[] = ['name', 'unitName', 'quantity', 'actions'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public menuService: MenuService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.menuForm = new FormGroup({
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
      ingredients: this.fb.array([]),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.menuService.getMenu(id).subscribe((result) => {
          this.menu = result.data;
          this.menuForm.patchValue({
            name: this.menu.name,
            description: this.menu.description,
            portions: this.menu.portions,
          });
          if (this.menu.ingredients != null){
            this.menu.ingredients.forEach(ingredient => {
              this.addIngredient(ingredient.name, ingredient.unitName, ingredient.quantity, false)
            });
          }
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

  updateView() {
    this.dataSource.next(this.ingredients.controls);
  }

  addIngredient(name: string, unitName: string, quantity: number, noUpdate?: boolean){
    const ingredientForm = this.fb.group({
      name: [name, Validators.required],
      unitName: [unitName, Validators.required],
      quantity: [quantity, Validators.required]
    });

    this.ingredients.push(ingredientForm);
    if (!noUpdate) { this.updateView(); }
  }

  deleteIngredient(ingredientIndex: number, noUpdate?: boolean) {
    this.ingredients.removeAt(ingredientIndex);
    if (!noUpdate) { this.updateView(); }
  }

  get ingredients(): FormArray {
    return this.menuForm.get('ingredients') as FormArray;
  }

  openDialog(element: MenuIngredient): void {
    const dialogRef = this.dialog.open(IngredientDialogComponent, {
      width: '250px',
      data: Object.assign({}, element)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      element = result;
    });
  }

  onSave() {
    if (!this.menuForm.valid) {
      return;
    }
    const menuToSave: Menu = {
      id: null,
      name: this.menuForm.value.name,
      description: this.menuForm.value.description,
      readonly: false,
      portions: this.menuForm.value.portions,
      ingredients: this.menuForm.value.ingredients,
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