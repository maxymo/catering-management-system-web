import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UnitService } from '../unit.service';
import { Unit } from '../unit.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.css'],
})
export class UnitFormComponent implements OnInit {
  form: FormGroup;
  mode: string = 'create';
  unit: Unit;
  isLoading = false;
  types = [];
  selectedType = 'Mass';

  constructor(
    public unitService: UnitService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(),
      type: new FormControl(),
    });
    this.types = this.unitService.getTypes();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.unitService.getUnit(id).subscribe((result) => {
          this.unit = result.data;
          console.log(this.unit);
          this.form.setValue({
            name: this.unit.name,
            description: this.unit.description,
            type: this.unit.type,
          });
          this.isLoading = false;
        });
      } else {
        this.unit = {
          id: null,
          name: '',
          description: '',
          type: '',
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

    const unitToSave: Unit = {
      id: null,
      name: this.form.value.name,
      description: this.form.value.description,
      type: this.form.value.type,
      readonly: false,
    };

    this.isLoading = true;
    if (this.mode === 'create') {
      this.unitService
        .addUnit(unitToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.id) {
            this.router.navigate(['/units']);
          } else {
            this.isLoading = false;
          }
        });
    } else {
      unitToSave.id = this.unit.id;
      this.unitService
        .updateUnit(unitToSave)
        .pipe(
          catchError((_) => {
            this.isLoading = false;
            return throwError(_);
          })
        )
        .subscribe((result) => {
          if (result.message) {
            this.router.navigate(['/units']);
          } else {
            this.isLoading = false;
          }
        });
    }
  }
}
