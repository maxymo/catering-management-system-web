import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { OrderService } from '../order.service';
import { Order } from '../order.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, startWith } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MenuLine } from '../menu.line.model';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { Observable } from 'rxjs';
import { DishService } from '../../dishes/dish.service';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { Dish } from '../../dishes/dish.model';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  mode = 'create';
  order!: Order;
  isLoading = false;
  displayColumns: string[] = ['name', 'headCount', 'actions'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  filteredDishes!: Observable<Dish[]>;
  ingredientListener!: Subscription;
  dishes!: Dish[];

  constructor(
    public orderService: OrderService,
    public dishService: DishService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(),
      date: new FormControl(null, {
        validators: [
          Validators.required,
        ]
      }),
      menu: this.fb.array([]),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;

      // Load dishes
      this.dishes = [];
      this.dishService.getDishes(0, 999999);
      this.ingredientListener = this.dishService
      .getDishUpdateListener()
      .subscribe((dishData) => {
        this.dishes = dishData.dishes;
      });

      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.orderService.getOrder(id ?? '').subscribe((result) => {
          this.order = result.data;
          this.orderForm.patchValue({
            name: this.order.name,
            description: this.order.description,
            date: this.order.date,
          });

          if (this.order.menu != null){
            this.order.menu.forEach(menuLine => {
              this.addMenuLine(menuLine.name, menuLine.headCount, false);
            });
          }
          this.isLoading = false;
        });
      } else {
        this.order = {
          id: '',
          name: '',
          description: '',
          readonly: false,
          date: new Date(),
          menu: MenuLine[0]
        };
        this.isLoading = false;
      }
    });
  }

  updateView() {
    this.dataSource.next(this.menuList.controls);
  }

  addMenuLine(name: string, headCount: number, noUpdate?: boolean){
    const dishControl = new FormControl(name, Validators.required);
    dishControl.valueChanges.subscribe(selectedValue => {
      this.filteredDishes = of(this._dishesFilter(selectedValue));
    });

    const menuLineForm = this.fb.group({
      name: dishControl,
      headCount: [headCount, Validators.required]
    });

    this.menuList.push(menuLineForm);
    if (!noUpdate) { this.updateView(); }
  }

  deleteMenuLine(menuLineIndex: number, noUpdate?: boolean) {
    this.menuList.removeAt(menuLineIndex);
    if (!noUpdate) { this.updateView(); }
  }

  get menuList(): FormArray {
    return this.orderForm.get('menu') as FormArray;
  }

  openDialog(element: MenuLine): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '250px',
      data: Object.assign({}, element)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      element = result;
    });
  }

  onSave() {
    if (!this.orderForm.valid) {
      return;
    }
    const orderToSave: Order = {
      id: '',
      name: this.orderForm.value.name,
      description: this.orderForm.value.description,
      readonly: false,
      date: this.orderForm.value.date,
      menu: this.orderForm.value.menu,
    };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.orderService
      .addOrder(orderToSave)
      .pipe(
        catchError((_) => {
          this.isLoading = false;
          return throwError(_);
        })
        )
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/orders']);
          } else {
            this.isLoading = false;
          }
        });
      } else {
        orderToSave.id = this.order.id;
        this.orderService
          .updateOrder(orderToSave)
          .pipe(
            catchError((_) => {
              this.isLoading = false;
              return throwError(_);
            })
          )
          .subscribe((result) => {
            if (result.message) {
              this.router.navigate(['/orders']);
            } else {
              this.isLoading = false;
            }
          });
    }
  }

  private _dishesFilter(value: string | null): Dish[] {
    console.log("value " + value);
    if (value == null){
      return new Dish[0];
    }

    const filterValue = value.toLowerCase();
    return this.dishes.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  onFocusDish(control: any){
    this.filteredDishes = of(this._dishesFilter(control.value));
  }

  onChange(control: any){
    console.log('I changed');
  }
}
