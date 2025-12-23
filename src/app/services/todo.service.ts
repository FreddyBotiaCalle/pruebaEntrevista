import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo.model';
import { APP_CONSTANTS } from '../core/constants/app.constants';
import { generateUniqueId } from '../core/utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private storageKey = APP_CONSTANTS.STORAGE_KEY;
  private initialized = false;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    await this.loadTodos();
    this.initialized = true;
  }

  /**
   * Obtener todos los todos como observable
   */
  getTodos(): Observable<Todo[]> {
    return this.todos$.asObservable();
  }

  /**
   * Obtener todos los todos (valor actual)
   */
  getTodosValue(): Todo[] {
    return this.todos$.value;
  }

  /**
   * Cargar todos desde el almacenamiento
   */
  async loadTodos(): Promise<void> {
    try {
      const todos = await this.storage.get(this.storageKey);
      this.todos$.next(todos || []);
    } catch (error) {
      console.error('Error al cargar todos:', error);
      this.todos$.next([]);
    }
  }

  /**
   * Crear una nueva tarea
   */
  async createTodo(data: CreateTodoDTO): Promise<Todo> {
    const newTodo: Todo = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      completed: false,
      dueDate: data.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const todos = this.getTodosValue();
    todos.push(newTodo);
    await this.saveTodos(todos);
    return newTodo;
  }

  /**
   * Obtener una tarea por ID
   */
  getTodo(id: string): Todo | undefined {
    return this.getTodosValue().find((todo) => todo.id === id);
  }

  /**
   * Actualizar una tarea
   */
  async updateTodo(id: string, data: UpdateTodoDTO): Promise<Todo> {
    const todos = this.getTodosValue();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo con ID ${id} no encontrado`);
    }

    const updatedTodo = {
      ...todos[index],
      ...data,
      id: todos[index].id,
      createdAt: todos[index].createdAt,
      updatedAt: new Date(),
    };

    todos[index] = updatedTodo;
    await this.saveTodos(todos);
    return updatedTodo;
  }

  /**
   * Eliminar una tarea
   */
  async deleteTodo(id: string): Promise<void> {
    const todos = this.getTodosValue();
    const filtered = todos.filter((todo) => todo.id !== id);
    await this.saveTodos(filtered);
  }

  /**
   * Marcar una tarea como completada/incompleta
   */
  async toggleTodo(id: string): Promise<Todo> {
    const todo = this.getTodo(id);
    if (!todo) {
      throw new Error(`Todo con ID ${id} no encontrado`);
    }

    return this.updateTodo(id, { completed: !todo.completed });
  }

  /**
   * Eliminar todas las tareas completadas
   */
  async clearCompleted(): Promise<void> {
    const todos = this.getTodosValue();
    const filtered = todos.filter((todo) => !todo.completed);
    await this.saveTodos(filtered);
  }

  /**
   * Obtener estadísticas
   */
  getStats() {
    const todos = this.getTodosValue();
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
    };
  }

  /**
   * Filtrar tareas por estado y búsqueda
   */
  filterTodos(
    todos: Todo[],
    searchTerm: string = '',
    filterType: 'all' | 'pending' | 'completed' = 'all'
  ): Todo[] {
    let filtered = todos;

    // Aplicar filtro por estado
    if (filterType === 'pending') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterType === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  /**
   * Guardar todos en el almacenamiento
   */
  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await this.storage.set(this.storageKey, todos);
      this.todos$.next(todos);
    } catch (error) {
      console.error('Error al guardar todos:', error);
      throw error;
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return generateUniqueId();
  }
}
