import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientService } from '../ingredient.service';
import { ShopService } from '../../shops/shop.service';
import { Ingredient } from '../ingredient.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Unit } from '../../units/unit.model';
import { UnitService } from '../../units/unit.service';
import { Subscription } from 'rxjs';

@Pipe({name: 'groupByUnitType'})
export class GroupByPipe implements PipeTransform {
    transform(collection: Array<Unit>, property: string = 'type'): Array<any> {
        if(!collection) {
            return null;
        }
        const gc = collection.reduce((previous, current)=> {
            if(!previous[current[property]]) {
                previous[current[property]] = [];
            }

            previous[current[property]].push({ name: current.name });
            previous[current[property]].sort((a, b) => a.name > b.name ? 1 : -1);
            return previous;
        }, {});
        return Object.keys(gc)
          .map(type => ({ type: type, units: gc[type] }))
          .sort((a, b) => a.type > b.type ? 1 : -1);
    }
}

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css'],
})
export class IngredientFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  mode: string = 'create';
  ingredient: Ingredient;
  isLoading = false;

  filteredShopNames: Observable<string[]>;
  shopNames: string[];

  unitListener: Subscription;
  filteredUnitsWhenBuying: Observable<Unit[]>;
  filteredUnitsWhenUsing: Observable<Unit[]>;
  units: Unit[];

  constructor(
    public ingredientService: IngredientService,
    public shopService: ShopService,
    public unitService: UnitService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var shopNameControl = new FormControl();
    var unitToBuyControl = new FormControl();
    var unitToUseControl = new FormControl();
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
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.ingredientService.getIngredient(id).subscribe((result) => {
          this.ingredient = result.data;
          console.log(this.ingredient);
          this.shopNames = [];
          this.shopService.getShopNames().subscribe((transformedShopsData) => {
            this.shopNames = transformedShopsData.shopNames.map((shop => {
              return shop.name
            }))
          });
          this.form.patchValue({
            name: this.ingredient.name,
            shopName: this.ingredient.shopName,
            description: this.ingredient.description,
            defaultUnitWhenUsing: this.ingredient.defaultUnitWhenUsing,
            defaultUnitWhenBuying: this.ingredient.defaultUnitWhenBuying,
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
          this.isLoading = false;
        });
      } else {
        this.ingredient = {
          id: null,
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

  ngOnDestroy(){
    this.unitListener.unsubscribe();
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    const ingredientToSave: Ingredient = {
      id: null,
      name: this.form.value.name,
      shopName: this.form.value.shopName,
      description: this.form.value.description,
      defaultUnitWhenUsing: this.form.value.defaultUnitWhenUsing,
      defaultUnitWhenBuying: this.form.value.defaultUnitWhenBuying,
      readonly: false,
    };

    this.isLoading = true;
    if (this.mode === 'create') {
      this.ingredientService
        .addIngredient(ingredientToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/ingredients']);
          } else {
            this.isLoading = false;
          }
        });
    } else {
      ingredientToSave.id = this.ingredient.id;
      this.ingredientService
        .updateIngredient(ingredientToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.message) {
            this.router.navigate(['/ingredients']);
          } else {
            this.isLoading = false;
          }
        });
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
