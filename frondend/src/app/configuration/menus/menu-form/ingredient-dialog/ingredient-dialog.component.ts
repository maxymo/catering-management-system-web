import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuIngredient } from '../../menu.ingredient.model';
import { MenuFormComponent } from '../menu-form.component';

@Component({
  selector: 'app-ingredient-dialog',
  templateUrl: 'ingredient-dialog.component.html',
})
export class IngredientDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MenuFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuIngredient) {
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
