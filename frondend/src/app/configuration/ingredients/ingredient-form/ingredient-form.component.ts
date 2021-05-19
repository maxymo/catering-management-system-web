import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientService } from '../ingredient.service';
import { ShopService } from '../../shops/shop.service';
import { Ingredient } from '../ingredient.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css'],
})
export class IngredientFormComponent implements OnInit {
  form: FormGroup;
  mode: string = 'create';
  ingredient: Ingredient;
  isLoading = false;
  filteredShopNames: Observable<string[]>;
  shopNames: string[];

  constructor(
    public ingredientService: IngredientService,
    public shopService: ShopService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var shopNameControl = new FormControl();
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      shopName: shopNameControl,
      description: new FormControl(),
      defaultUnitWhenBuying: new FormControl(),
      defaultUnitWhenUsing: new FormControl(),

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
            console.log(transformedShopsData);
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
            map(value => this._filter(value))
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.shopNames.filter(option => option.toLowerCase().includes(filterValue));
  }
}
