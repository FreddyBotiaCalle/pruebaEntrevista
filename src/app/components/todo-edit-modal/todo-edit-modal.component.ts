import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { Todo, UpdateTodoDTO } from '../../models/todo.model';

@Component({
  selector: 'app-todo-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
  ],
  templateUrl: './todo-edit-modal.component.html',
  styleUrls: ['./todo-edit-modal.component.scss'],
})
export class TodoEditModalComponent implements OnInit {
  @Input() todo!: Todo;
  editForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      title: [this.todo.title, [Validators.required, Validators.minLength(3)]],
      description: [this.todo.description || ''],
      dueDate: [this.todo.dueDate ? new Date(this.todo.dueDate).toISOString().split('T')[0] : ''],
    });
  }

  get title() {
    return this.editForm.get('title');
  }

  async onSubmit() {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    const formValue = this.editForm.value;
    const data: UpdateTodoDTO = {
      title: formValue.title.trim(),
      description: formValue.description?.trim(),
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
    };

    await this.modalController.dismiss(data, 'confirm');
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }
}
