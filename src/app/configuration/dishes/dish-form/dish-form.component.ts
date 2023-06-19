import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { DishService } from '../dish.service';
import { Dish } from '../dish.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DishIngredient } from '../dish.ingredient.model';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';
import { Observable } from 'rxjs';
import { Unit } from '../../units/unit.model';
import { UnitService } from '../../units/unit.service';
import { IngredientService } from '../../ingredients/ingredient.service';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { Ingredient } from '../../ingredients/ingredient.model';

@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css'],
})
export class DishFormComponent implements OnInit {
  dishForm!: FormGroup;
  mode = 'create';
  dish!: Dish;
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
    public DishService: DishService,
    public unitService: UnitService,
    public ingredientService: IngredientService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dishForm = new FormGroup({
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

      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.DishService.getDish(id ?? '').subscribe((result) => {
          this.dish = result.data;
          this.dishForm.patchValue({
            name: this.dish.name,
            description: this.dish.description,
            portions: this.dish.portions,
          });

          if (this.dish.ingredients != null){
            this.dish.ingredients.forEach(ingredient => {
              this.addIngredient(ingredient.name, ingredient.unitName, ingredient.quantity, false);
            });
          }
          this.isLoading = false;
        });
      } else {
        this.dish = {
          id: '',
          name: '',
          description: '',
          readonly: false,
          portions: 0,
          ingredients: DishIngredient[0]
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
    return this.dishForm.get('ingredients') as FormArray;
  }

  openDialog(element: DishIngredient): void {
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
    if (!this.dishForm.valid) {
      return;
    }
    const dishToSave: Dish = {
      id: '',
      name: this.dishForm.value.name,
      description: this.dishForm.value.description,
      readonly: false,
      portions: this.dishForm.value.portions,
      ingredients: this.dishForm.value.ingredients,
    };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.DishService
      .addDish(dishToSave)
      .pipe(
        catchError((_) => {
          this.isLoading = false;
          return throwError(_);
        })
        )
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/dishes']);
          } else {
            this.isLoading = false;
          }
        });
      } else {
        dishToSave.id = this.dish.id;
        this.DishService
          .updateDish(dishToSave)
          .pipe(
            catchError((_) => {
              this.isLoading = false;
              return throwError(_);
            })
          )
          .subscribe((result) => {
            if (result.message) {
              this.router.navigate(['/dishes']);
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
    console.log("value " + value);
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
