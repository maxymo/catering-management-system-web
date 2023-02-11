import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MenuIngredient } from '../menu.ingredient.model';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';
import { Observable } from 'rxjs';
import { Unit } from '../../units/unit.model';
import { UnitService } from '../../units/unit.service';
import { IngredientService } from '../../ingredients/ingredient.service';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { Ingredient } from '../../ingredients/ingredient.model';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  menuForm!: FormGroup;
  mode = 'create';
  menu!: Menu;
  isLoading = false;
  displayColumns: string[] = ['name', 'unitName', 'quantity', 'actions'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  filteredUnits!: Observable<Unit[]>;
  unitListener!: Subscription;
  units!: Unit[];

  filteredIngredients!: Observable<Ingredient[]>;
  ingredientListener!: Subscription;
  ingredients!: Ingredient[];

  constructor(
    public menuService: MenuService,
    public unitService: UnitService,
    public ingredientService: IngredientService,
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
        this.menuService.getMenu(id ?? '').subscribe((result) => {
          this.menu = result.data;
          this.menuForm.patchValue({
            name: this.menu.name,
            description: this.menu.description,
            portions: this.menu.portions,
          });

          // Load units
          this.units = [];
          this.unitService.getUnits(0, 999999);
          this.unitListener = this.unitService
          .getUnitUpdateListener()
          .subscribe((unitData) => {
            this.units = unitData.units;
            console.log(unitData.units);
          });

          // Load ingredients
          this.ingredients = [];
          this.ingredientService.getIngredients(0, 999999);
          this.ingredientListener = this.ingredientService
          .getIngredientUpdateListener()
          .subscribe((ingredientData) => {
            this.ingredients = ingredientData.ingredients;
            console.log(ingredientData.ingredients);
          });

          if (this.menu.ingredients != null){
            this.menu.ingredients.forEach(ingredient => {
              this.addIngredient(ingredient.name, ingredient.unitName, ingredient.quantity, false);
            });
          }
          this.isLoading = false;
        });
      } else {
        this.menu = {
          id: '',
          name: '',
          description: '',
          readonly: false,
          portions: 0,
          ingredients: MenuIngredient[0]
        };
        this.isLoading = false;
      }
    });
  }

  updateView() {
    this.dataSource.next(this.ingredientList.controls);
  }

  addIngredient(name: string, unitName: string, quantity: number, noUpdate?: boolean){
    const unitControl = new FormControl(unitName, Validators.required);
    unitControl.valueChanges.subscribe(selectedValue => {
      this.filteredUnits = of(this._unitsFilter(selectedValue));
    });

    const ingredientControl = new FormControl(name, Validators.required);
    ingredientControl.valueChanges.subscribe(selectedValue => {
      this.filteredIngredients = of(this._ingredientsFilter(selectedValue));
    });

    const ingredientForm = this.fb.group({
      name: ingredientControl,
      unitName: unitControl,
      quantity: [quantity, Validators.required]
    });

    this.ingredientList.push(ingredientForm);
    if (!noUpdate) { this.updateView(); }
  }

  deleteIngredient(ingredientIndex: number, noUpdate?: boolean) {
    this.ingredientList.removeAt(ingredientIndex);
    if (!noUpdate) { this.updateView(); }
  }

  get ingredientList(): FormArray {
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
      id: '',
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

  private _unitsFilter(value: string | null): Unit[] {
    if (value == null){
      return new Unit[0];
    }

    const filterValue = value.toLowerCase();

    return this.units.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _ingredientsFilter(value: string | null): Ingredient[] {
    if (value == null){
      return new Ingredient[0];
    }

    const filterValue = value.toLowerCase();
    return this.ingredients.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  onFocusUnit(control: any){
    this.filteredUnits = of(this._unitsFilter(control.value));
  }

  onFocusIngredient(control: any){
    this.filteredIngredients = of(this._ingredientsFilter(control.value));
  }

  onChange(control: any){
    console.log('I changed');
  }
}
