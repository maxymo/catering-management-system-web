import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DishIngredient } from '../../dish.ingredient.model';
import { DishFormComponent } from '../dish-form.component';

@Component({
  selector: 'app-ingredient-dialog',
  templateUrl: 'ingredient-dialog.component.html',
})
export class IngredientDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DishFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DishIngredient) {
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
