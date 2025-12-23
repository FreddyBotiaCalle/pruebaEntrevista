import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { TodoService } from '../../services/todo.service';
import { CreateTodoDTO } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  todoForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.todoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: [''],
    });
  }

  get title() {
    return this.todoForm.get('title');
  }

  get description() {
    return this.todoForm.get('description');
  }

  async onSubmit() {
    this.submitted = true;

    if (this.todoForm.invalid) {
      return;
    }

    try {
      const formValue = this.todoForm.value;
      const dto: CreateTodoDTO = {
        title: formValue.title.trim(),
        description: formValue.description?.trim(),
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      };

      await this.todoService.createTodo(dto);
      this.todoForm.reset();
      this.submitted = false;
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  }

  resetForm() {
    this.todoForm.reset();
    this.submitted = false;
  }
}
