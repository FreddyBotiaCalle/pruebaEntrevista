import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoFormComponent } from './todo-form.component';
import { TodoService } from '../../services/todo.service';
import { Storage } from '@ionic/storage-angular';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let todoService: TodoService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    storageSpy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);

    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, ReactiveFormsModule],
      providers: [TodoService, { provide: Storage, useValue: storageSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.todoForm.valid).toBeFalsy();
  });

  it('should have valid form when title is filled', () => {
    component.todoForm.patchValue({
      title: 'Test Todo',
    });

    expect(component.todoForm.valid).toBeTruthy();
  });

  it('should not submit with invalid form', async () => {
    component.todoForm.patchValue({
      title: 'A', // Too short
    });

    component.submitted = false;
    await component.onSubmit();

    expect(component.submitted).toBeTruthy();
    expect(component.todoForm.valid).toBeFalsy();
  });

  it('should reset form after successful submission', async () => {
    storageSpy.set = jasmine.createSpy('set').and.returnValue(Promise.resolve());

    component.todoForm.patchValue({
      title: 'New Todo',
      description: 'Test Description',
    });

    await component.onSubmit();

    expect(component.todoForm.value.title).toBeNull();
    expect(component.todoForm.value.description).toBeNull();
  });

  it('should reset form when calling resetForm', () => {
    component.todoForm.patchValue({
      title: 'Test',
      description: 'Test',
    });

    component.resetForm();

    expect(component.todoForm.value.title).toBeNull();
    expect(component.todoForm.value.description).toBeNull();
    expect(component.submitted).toBeFalsy();
  });
});
