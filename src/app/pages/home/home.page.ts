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
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import { NotificationService } from '../../services/notification.service';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent, FilterType } from '../../components/todo-filters/todo-filters.component';
import { TodoEditModalComponent } from '../../components/todo-edit-modal/todo-edit-modal.component';
import { Todo } from '../../models/todo.model';

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
    TodoFormComponent,
    TodoListComponent,
    TodoFiltersComponent,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  stats = { total: 0, completed: 0, pending: 0 };
  searchTerm = '';
  filterType: FilterType = 'all';
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private notificationService: NotificationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodos() {
    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => {
        this.todos = todos;
        this.applyFilters();
        this.updateStats();
      });
  }

  private applyFilters() {
    this.filteredTodos = this.todoService.filterTodos(this.todos, this.searchTerm, this.filterType);
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onFilterChange(filterType: FilterType) {
    this.filterType = filterType;
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

  private updateStats() {
    this.stats = this.todoService.getStats();
  }
}
