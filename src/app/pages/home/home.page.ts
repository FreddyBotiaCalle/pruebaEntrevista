import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  ModalController,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { LoggerService } from '../../services/logger.service';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent, FilterType } from '../../components/todo-filters/todo-filters.component';
import { TodoEditModalComponent } from '../../components/todo-edit-modal/todo-edit-modal.component';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { FeatureFlagsComponent } from '../../components/feature-flags/feature-flags.component';
import { Todo } from '../../models/todo.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonSpinner,
    TodoFormComponent,
    TodoListComponent,
    TodoFiltersComponent,
    CategoryListComponent,
    FeatureFlagsComponent,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  categories: Category[] = [];
  stats = { total: 0, completed: 0, pending: 0 };
  searchTerm = '';
  filterType: FilterType = 'all';
  selectedCategoryId = '';
  isLoading = true;
  categoriesEnabled = true;
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private modalController: ModalController,
    private logger: LoggerService
  ) {
    this.logger.info('HomePage constructor');
  }

  ngOnInit() {
    this.logger.info('HomePage ngOnInit');
    this.initializePage();
  }

  private async initializePage() {
    try {
      // Esperar a que los servicios estén inicializados, máximo 2 segundos
      const maxWaitTime = 2000;
      const startTime = Date.now();

      while (
        (!this.todoService.isInitialized() || !this.categoryService.isServiceInitialized() || !this.firebaseService.isServiceInitialized()) &&
        Date.now() - startTime < maxWaitTime
      ) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Mostrar contenido aunque los servicios no estén listos
      this.isLoading = false;

      // Monitorear el feature flag de categorías habilitadas
      this.firebaseService
        .getFeatureFlags()
        .pipe(takeUntil(this.destroy$))
        .subscribe((flags: any) => {
          this.categoriesEnabled = flags.categoriesEnabled !== false;
          this.logger.info(`Feature flag categoriesEnabled: ${this.categoriesEnabled}`);
        });

      this.loadCategories();
      this.loadTodos();
    } catch (error) {
      this.logger.error('Error inicializando página', error);
      this.isLoading = false;
      await this.notificationService.showError('Error al cargar los datos');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.logger.info('Cargando categorías');
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.logger.info(`Se cargaron ${categories.length} categorías`);
          this.categories = categories;
        },
        error: (error) => {
          this.logger.error('Error cargando categorías', error);
        },
      });
  }

  loadTodos() {
    this.logger.info('Cargando tareas');
    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          this.logger.info(`Se cargaron ${todos.length} tareas`);
          this.todos = todos;
          this.applyFilters();
          this.updateStats();
        },
        error: (error) => {
          this.logger.error('Error cargando tareas', error);
          this.notificationService.showError('Error al cargar las tareas');
        },
      });
  }

  private applyFilters() {
    this.filteredTodos = this.todoService.filterTodos(
      this.todos,
      this.searchTerm,
      this.filterType,
      this.selectedCategoryId
    );
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onFilterChange(filterType: FilterType) {
    this.filterType = filterType;
    this.applyFilters();
  }

  onCategoryFilterChange(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  async onDeleteTodo(id: string) {
    const confirmed = await this.notificationService.showConfirmation(
      'Eliminar tarea',
      '¿Está seguro de que desea eliminar esta tarea?'
    );

    if (confirmed) {
      try {
        await this.todoService.deleteTodo(id);
        await this.notificationService.showSuccess('Tarea eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        await this.notificationService.showError('Error al eliminar la tarea');
      }
    }
  }

  async onToggleTodo(id: string) {
    try {
      await this.todoService.toggleTodo(id);
      const todo = this.todoService.getTodo(id);
      const message = todo?.completed ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente';
      await this.notificationService.showSuccess(message);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      await this.notificationService.showError('Error al actualizar la tarea');
    }
  }

  async onEditTodo(todo: Todo) {
    const modal = await this.modalController.create({
      component: TodoEditModalComponent,
      componentProps: { todo },
      cssClass: 'todo-edit-modal',
    });

    await modal.present();
    const result = await modal.onDidDismiss();

    if (result.role === 'confirm' && result.data) {
      try {
        await this.todoService.updateTodo(todo.id, result.data);
        await this.notificationService.showSuccess('Tarea actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        await this.notificationService.showError('Error al actualizar la tarea');
      }
    }
  }

  async clearCompleted() {
    const confirmed = await this.notificationService.showConfirmation(
      'Limpiar completadas',
      '¿Desea eliminar todas las tareas completadas?'
    );

    if (confirmed) {
      try {
        await this.todoService.clearCompleted();
        await this.notificationService.showSuccess('Tareas completadas eliminadas');
      } catch (error) {
        console.error('Error al limpiar tareas completadas:', error);
        await this.notificationService.showError('Error al limpiar tareas completadas');
      }
    }
  }

  async openCategoryModal(category?: Category) {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      cssClass: 'category-modal',
    });

    if (category) {
      // Set the category data before presenting
      const modalElement = modal as any;
      if (modalElement.component) {
        // Create an instance to set the data
        const instance = (modal as any).componentInstance;
        if (instance && instance.setEditingCategory) {
          instance.setEditingCategory(category);
        }
      }
    }

    await modal.present();
    const result = await modal.onDidDismiss();

    if (result.data?.refresh) {
      this.loadCategories();
    }
  }

  onCreateCategory() {
    this.openCategoryModal();
  }

  onEditCategory(category: Category) {
    this.openCategoryModal(category);
  }

  private updateStats() {
    this.stats = this.todoService.getStats();
  }
}
