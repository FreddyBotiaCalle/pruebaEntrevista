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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, pencil } from 'ionicons/icons';
import { Todo } from '../../models/todo.model';

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
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() toggleTodo = new EventEmitter<string>();
  @Output() editTodo = new EventEmitter<Todo>();

  constructor() {
    addIcons({ trash, pencil });
  }

  ngOnInit() {}

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
}
