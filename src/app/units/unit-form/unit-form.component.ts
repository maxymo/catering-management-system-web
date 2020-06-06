import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UnitService } from '../unit.service';
import { Unit } from '../unit.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.mode = 'edit';
        this.unitService.getUnit(id).subscribe((result) => {
          this.unit = result.data;
          this.form.setValue({
            name: this.unit.name,
            description: this.unit.description,
          });
          this.isLoading = false;
        });
      } else {
        this.unit = {
          id: null,
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

    const unitToSave: Unit = {
      id: null,
      name: this.form.value.name,
      description: this.form.value.description,
      readonly: false,
    };

    this.isLoading = true;
    if (this.mode === 'create') {
      this.unitService.addUnit(unitToSave).subscribe((result) => {
        if (result.id) {
          this.router.navigate(['/units']);
        } else {
          this.isLoading = false;
        }
      });
    } else {
      unitToSave.id = this.unit.id;
      this.unitService.updateUnit(unitToSave).subscribe((result) => {
        if (result.message) {
          this.router.navigate(['/units']);
        } else {
          this.isLoading = false;
        }
      });
    }
  }
}
