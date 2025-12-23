import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Categorías</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div *ngIf="categories.length === 0" style="text-align: center; padding: 2rem;">
          <p style="color: #999;">No hay categorías. Crea una nueva.</p>
        </div>

        <div *ngIf="categories.length > 0" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <div
            *ngFor="let category of categories"
            style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem 1rem;
              background-color: {{ category.color }};
              color: white;
              border-radius: 20px;
              font-size: 0.9rem;
            "
          >
            <span>{{ category.name }}</span>
            <button
              type="button"
              (click)="onEditCategory(category)"
              style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;"
              title="Editar"
            >
              <ion-icon name="pencil"></ion-icon>
            </button>
          </div>
        </div>

        <ion-button expand="block" color="primary" (click)="onCreateCategory()" style="margin-top: 1rem;">
          <ion-icon name="add" slot="start"></ion-icon>
          Nueva Categoría
        </ion-button>
      </ion-card-content>
    </ion-card>
  `
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Output() createCategory = new EventEmitter<void>();
  @Output() editCategory = new EventEmitter<Category>();

  onCreateCategory(): void {
    this.createCategory.emit();
  }

  onEditCategory(category: Category): void {
    this.editCategory.emit(category);
  }
}
