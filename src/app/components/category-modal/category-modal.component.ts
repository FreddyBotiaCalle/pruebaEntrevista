import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../models/category.model';

const COLORS = [
  '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
  '#1abc9c', '#34495e', '#e67e22', '#c0392b', '#16a085'
];

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="categoryForm" (ngSubmit)="submitForm()">
        <!-- Nombre -->
        <ion-item>
          <ion-label position="stacked">Nombre</ion-label>
          <ion-input
            formControlName="name"
            placeholder="Ej: Trabajo"
            type="text"
          ></ion-input>
        </ion-item>
        <ion-text color="danger" *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched">
          <p style="font-size: 12px; margin: 4px 0;">El nombre es requerido</p>
        </ion-text>

        <!-- Descripción -->
        <ion-item>
          <ion-label position="stacked">Descripción (Opcional)</ion-label>
          <ion-textarea
            formControlName="description"
            placeholder="Describe esta categoría"
            rows="3"
          ></ion-textarea>
        </ion-item>

        <!-- Color -->
        <div style="margin: 1rem 0;">
          <ion-label>Color</ion-label>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
            <button
              type="button"
              *ngFor="let color of colors"
              (click)="selectColor(color)"
              style="
                width: 100%;
                height: 50px;
                border-radius: 8px;
                border: 3px solid;
                background-color: {{ color }};
                border-color: {{ categoryForm.get('color')?.value === color ? '#000' : '#ddd' }};
                cursor: pointer;
              "
            ></button>
          </div>
        </div>

        <!-- Botones -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem;">
          <ion-button expand="block" color="medium" (click)="dismiss()">
            Cancelar
          </ion-button>
          <ion-button expand="block" color="primary" [disabled]="categoryForm.invalid" type="submit">
            {{ editingCategory ? 'Actualizar' : 'Crear' }}
          </ion-button>
        </div>

        <!-- Botón eliminar (solo si está editando) -->
        <ion-button
          *ngIf="editingCategory"
          expand="block"
          color="danger"
          (click)="deleteCategory()"
          style="margin-top: 1rem;"
        >
          Eliminar Categoría
        </ion-button>
      </form>
    </ion-content>
  `
})
export class CategoryModalComponent implements OnInit {
  categoryForm!: FormGroup;
  colors = COLORS;
  editingCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private modalController: ModalController
  ) {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#3498db']
    });
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  async submitForm(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.notificationService.showError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const formData = this.categoryForm.value;

      if (this.editingCategory) {
        await this.categoryService.updateCategory(this.editingCategory.id, formData);
        this.notificationService.showSuccess('Categoría actualizada');
      } else {
        await this.categoryService.createCategory(formData);
        this.notificationService.showSuccess('Categoría creada');
      }

      this.dismiss(true);
    } catch (error) {
      this.notificationService.showError('Error al guardar la categoría');
    }
  }

  async deleteCategory(): Promise<void> {
    if (!this.editingCategory) return;

    const result = await this.notificationService.showConfirmation(
      '¿Estás seguro de que deseas eliminar esta categoría?',
      'Esta acción no se puede deshacer'
    );

    if (result) {
      try {
        await this.categoryService.deleteCategory(this.editingCategory.id);
        this.notificationService.showSuccess('Categoría eliminada');
        this.dismiss(true);
      } catch (error) {
        this.notificationService.showError('Error al eliminar la categoría');
      }
    }
  }

  dismiss(refresh = false): void {
    this.modalController.dismiss({ refresh });
  }

  setEditingCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      color: category.color
    });
  }
}
