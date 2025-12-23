import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { TodoService } from './todo.service';
import { CreateTodoDTO } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    TestBed.configureTestingModule({
      providers: [TodoService, { provide: Storage, useValue: spy }],
    });
    service = TestBed.inject(TodoService);
    storageMock = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTodo', () => {
    it('should create a new todo with all required fields', async () => {
      const dto: CreateTodoDTO = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      storageMock.set.and.returnValue(Promise.resolve());

      const result = await service.createTodo(dto);

      expect(result.title).toBe('Test Todo');
      expect(result.description).toBe('Test Description');
      expect(result.completed).toBe(false);
      expect(result.id).toBeTruthy();
    });

    it('should throw error if title is empty', async () => {
      const dto: CreateTodoDTO = {
        title: '',
      };

      try {
        await service.createTodo(dto);
        fail('Should have thrown an error');
      } catch (error) {
        // Error expected
      }
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      storageMock.set.and.returnValue(Promise.resolve());

      // Create first
      const createDto: CreateTodoDTO = { title: 'Original' };
      const todo = await service.createTodo(createDto);

      // Update
      const updated = await service.updateTodo(todo.id, { title: 'Updated' });

      expect(updated.title).toBe('Updated');
      expect(updated.id).toBe(todo.id);
    });

    it('should throw error if todo not found', async () => {
      try {
        await service.updateTodo('non-existent-id', { title: 'Updated' });
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toContain('no encontrado');
      }
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      storageMock.set.and.returnValue(Promise.resolve());

      const createDto: CreateTodoDTO = { title: 'To Delete' };
      const todo = await service.createTodo(createDto);

      await service.deleteTodo(todo.id);

      expect(service.getTodo(todo.id)).toBeUndefined();
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', async () => {
      storageMock.set.and.returnValue(Promise.resolve());

      const createDto: CreateTodoDTO = { title: 'Test' };
      const todo = await service.createTodo(createDto);

      expect(todo.completed).toBe(false);

      const toggled = await service.toggleTodo(todo.id);
      expect(toggled.completed).toBe(true);

      const toggled2 = await service.toggleTodo(todo.id);
      expect(toggled2.completed).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      storageMock.set.and.returnValue(Promise.resolve());

      await service.createTodo({ title: 'Todo 1' });
      await service.createTodo({ title: 'Todo 2' });
      await service.createTodo({ title: 'Todo 3' });

      const todoId = service.getTodosValue()[0].id;
      await service.toggleTodo(todoId);

      const stats = service.getStats();

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
    });
  });

  describe('filterTodos', () => {
    beforeEach(async () => {
      storageMock.set.and.returnValue(Promise.resolve());
      await service.createTodo({ title: 'Buy groceries' });
      await service.createTodo({ title: 'Complete project' });
      await service.createTodo({ title: 'Call mom' });

      // Toggle first todo as completed
      const todos = service.getTodosValue();
      await service.toggleTodo(todos[0].id);
    });

    it('should filter todos by search term', () => {
      const todos = service.getTodosValue();
      const filtered = service.filterTodos(todos, 'buy');

      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toContain('Buy');
    });

    it('should filter pending todos', () => {
      const todos = service.getTodosValue();
      const filtered = service.filterTodos(todos, '', 'pending');

      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => !t.completed)).toBe(true);
    });

    it('should filter completed todos', () => {
      const todos = service.getTodosValue();
      const filtered = service.filterTodos(todos, '', 'completed');

      expect(filtered.length).toBe(1);
      expect(filtered.every((t) => t.completed)).toBe(true);
    });

    it('should combine search and filter', () => {
      const todos = service.getTodosValue();
      const filtered = service.filterTodos(todos, 'complete', 'pending');

      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toContain('complete');
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', async () => {
      storageMock.set.and.returnValue(Promise.resolve());

      await service.createTodo({ title: 'Todo 1' });
      await service.createTodo({ title: 'Todo 2' });

      const todos = service.getTodosValue();
      await service.toggleTodo(todos[0].id);
      await service.toggleTodo(todos[1].id);

      let stats = service.getStats();
      expect(stats.completed).toBe(2);

      await service.clearCompleted();

      stats = service.getStats();
      expect(stats.completed).toBe(0);
      expect(stats.total).toBe(0);
    });
  });
});
