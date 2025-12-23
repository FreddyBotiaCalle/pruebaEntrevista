import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, pencil } from 'ionicons/icons';
import { Todo } from '../../models/todo.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() toggleTodo = new EventEmitter<string>();
  @Output() editTodo = new EventEmitter<Todo>();

  categories: Map<string, Category> = new Map();

  constructor(private categoryService: CategoryService) {
    addIcons({ trash, pencil });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.clear();
      categories.forEach(cat => this.categories.set(cat.id, cat));
    });
  }

  onDelete(id: string) {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
      this.deleteTodo.emit(id);
    }
  }

  onToggle(id: string) {
    this.toggleTodo.emit(id);
  }

  onEdit(todo: Todo) {
    this.editTodo.emit(todo);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES');
  }

  getCategory(categoryId: string | undefined): Category | undefined {
    return categoryId ? this.categories.get(categoryId) : undefined;
  }
}
