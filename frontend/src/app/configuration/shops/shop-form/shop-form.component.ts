import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopService } from '../shop.service';
import { Shop } from '../shop.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.css'],
})
export class ShopFormComponent implements OnInit {
  form!: FormGroup;
  mode = 'create';
  shop!: Shop;
  isLoading = false;

  constructor(
    public shopService: ShopService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.shopService.getShop(id ?? '').subscribe((result) => {
          this.shop = result.data;
          console.log(this.shop);
          this.form.setValue({
            name: this.shop.name,
            description: this.shop.description,
          });
          this.isLoading = false;
        });
      } else {
        this.shop = {
          id: '',
          name: '',
          description: '',
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

    const shopToSave: Shop = {
      id: '',
      name: this.form.value.name,
      description: this.form.value.description,
      readonly: false,
    };
    try{
      this.isLoading = true;
      if (this.mode === 'create') {
        return this.shopService
          .addShop(shopToSave)
          .subscribe((result) => {
            if (result.id) {
              return this.router.navigate(['/shops']);
            } else {
              this.isLoading = false;
              return;
            }
          });

      } else {
        shopToSave.id = this.shop.id;
        return this.shopService
          .updateShop(shopToSave)
          .subscribe((result) => {
            if (result.message) {
              return this.router.navigate(['/shops']);
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
}
