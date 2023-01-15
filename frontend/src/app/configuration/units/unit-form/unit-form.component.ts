import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Unit } from '../unit.model';
import { UnitService } from '../unit.service';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.css']
})
export class UnitFormComponent implements OnInit {
  form!: FormGroup;
  mode = 'create';
  unit!: Unit;
  isLoading = false;
  types!: string[];
  selectedType = 'Mass';

  constructor(
    public unitService: UnitService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

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
        const id = paramMap.get('id') ?? "";
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
          id: '',
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
      id: '',
      name: this.form.value.name,
      description: this.form.value.description,
      type: this.form.value.type,
      readonly: false,
    };

    try {
      this.isLoading = true;
      if (this.mode === 'create') {
        return this.unitService
          .addUnit(unitToSave)
          .subscribe((result) => {
            if (result.id) {
              return this.router.navigate(['/units']);
            } else {
              return this.isLoading = false;
            }
          });
      } else {
        unitToSave.id = this.unit.id;
        return this.unitService
          .updateUnit(unitToSave)
          .subscribe((result) => {
            if (result.message) {
              return this.router.navigate(['/units']);
            } else {
              return this.isLoading = false;
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
