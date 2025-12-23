import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { CreateTodoDTO } from '../../models/todo.model';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';

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
    IonSelect,
    IonSelectOption,
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  todoForm!: FormGroup;
  submitted = false;
  categories$: Observable<Category[]>;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService
  ) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.todoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: [''],
      categoryId: [''],
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
        categoryId: formValue.categoryId || undefined,
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
