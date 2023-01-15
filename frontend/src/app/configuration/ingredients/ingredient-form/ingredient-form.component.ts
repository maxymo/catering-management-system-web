import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientService } from '../ingredient.service';
import { ShopService } from '../../shops/shop.service';
import { Ingredient } from '../ingredient.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Unit } from '../../units/unit.model';
import { UnitService } from '../../units/unit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css'],
})
export class IngredientFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  mode = 'create';
  ingredient!: Ingredient;
  isLoading = false;

  filteredShopNames!: Observable<string[]>;
  shopNames!: string[];

  unitListener!: Subscription;
  filteredUnitsWhenBuying!: Observable<Unit[]>;
  filteredUnitsWhenUsing!: Observable<Unit[]>;
  units!: Unit[];

  constructor(
    public ingredientService: IngredientService,
    public shopService: ShopService,
    public unitService: UnitService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const shopNameControl = new FormControl();
    const unitToBuyControl = new FormControl();
    const unitToUseControl = new FormControl();
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      shopName: shopNameControl,
      description: new FormControl(),
      defaultUnitWhenBuying: unitToBuyControl,
      defaultUnitWhenUsing: unitToUseControl,
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;

      this.initializeFilters(shopNameControl, unitToBuyControl, unitToUseControl);

      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.ingredientService.getIngredient(id ?? '').subscribe((result) => {
          this.ingredient = result.data;
          this.form.patchValue({
            name: this.ingredient.name,
            shopName: this.ingredient.shopName,
            description: this.ingredient.description,
            defaultUnitWhenUsing: this.ingredient.defaultUnitWhenUsing,
            defaultUnitWhenBuying: this.ingredient.defaultUnitWhenBuying,
          });

          this.isLoading = false;
        });
      } else {
        this.ingredient = {
          id: '',
          name: '',
          shopName: '',
          description: '',
          defaultUnitWhenUsing: '',
          defaultUnitWhenBuying: '',
          readonly: false,
        };
        this.isLoading = false;
      }
    });
  }

  initializeFilters(
    shopNameControl: FormControl,
    unitToBuyControl: FormControl,
    unitToUseControl: FormControl){
    this.shopNames = [];
    this.shopService.getShopNames().subscribe((transformedShopsData) => {
      this.shopNames = transformedShopsData.shopNames.map((shop => {
        return shop.name;
      }));
    });
    this.filteredShopNames = shopNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._shopsFilter(value))
      );

    this.units = [];
    this.unitService.getUnits(0, 999999);
    this.unitListener = this.unitService
      .getUnitUpdateListener()
      .subscribe((unitData) => {
        this.units = unitData.units;
        console.log(unitData.units);
      });
    this.filteredUnitsWhenBuying = unitToBuyControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._unitsFilter(value))
      );
    this.filteredUnitsWhenUsing = unitToUseControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._unitsFilter(value))
      );
  }

  ngOnDestroy(){
    this.unitListener.unsubscribe();
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    const ingredientToSave: Ingredient = {
      id: '',
      name: this.form.value.name,
      shopName: this.form.value.shopName,
      description: this.form.value.description,
      defaultUnitWhenUsing: this.form.value.defaultUnitWhenUsing,
      defaultUnitWhenBuying: this.form.value.defaultUnitWhenBuying,
      readonly: false,
    };

    this.isLoading = true;
    try{
      if (this.mode === 'create') {
        return this.ingredientService
          .addIngredient(ingredientToSave)
          .subscribe((result) => {
            if (result.id) {
              return this.router.navigate(['/ingredients']);
            } else {
              return this.isLoading = false;
            }
          });
      } else {
        ingredientToSave.id = this.ingredient.id;
        return this.ingredientService
          .updateIngredient(ingredientToSave)
          .subscribe((result) => {
            if (result.message) {
              return this.router.navigate(['/ingredients']);
            } else {
              this.isLoading = false;
              return;
            }
          });
      }
    }
    catch (e){
      this.isLoading = false;
      throw e;
    }
  }

  private _shopsFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.shopNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _unitsFilter(value: string): Unit[] {
    const filterValue = value.toLowerCase();

    return this.units.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
