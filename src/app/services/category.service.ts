import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';
import { generateUniqueId } from '../core/utils/helpers';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories$ = new BehaviorSubject<Category[]>([]);
  private isInitialized = false;
  private storage: Storage | null = null;

  constructor(
    private ionicStorage: Storage,
    private logger: LoggerService
  ) {}

  /**
   * Initialize the category service
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.storage = await this.ionicStorage.create();
      const categories = await this.storage.get('categories') || [];
      this.categories$.next(categories);

      // Create sample categories if empty
      if (categories.length === 0) {
        await this.createSampleCategories();
      }

      this.isInitialized = true;
      this.logger.info('CategoryService initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing CategoryService:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    try {
      const category: Category = {
        id: generateUniqueId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const categories = this.categories$.value;
      const updated = [...categories, category];
      this.categories$.next(updated);

      if (this.storage) {
        await this.storage.set('categories', updated);
      }

      this.logger.info(`Category created: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update a category
   */
  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    try {
      const categories = this.categories$.value;
      const index = categories.findIndex(c => c.id === id);

      if (index === -1) {
        throw new Error(`Category with id ${id} not found`);
      }

      const updated = {
        ...categories[index],
        ...data,
        updatedAt: new Date()
      };

      categories[index] = updated;
      this.categories$.next([...categories]);

      if (this.storage) {
        await this.storage.set('categories', categories);
      }

      this.logger.info(`Category updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      const categories = this.categories$.value.filter(c => c.id !== id);
      this.categories$.next(categories);

      if (this.storage) {
        await this.storage.set('categories', categories);
      }

      this.logger.info(`Category deleted: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: string): Category | undefined {
    return this.categories$.value.find(c => c.id === id);
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Create sample categories
   */
  private async createSampleCategories(): Promise<void> {
    const sampleCategories: CreateCategoryDTO[] = [
      { name: 'Trabajo', color: '#3498db', description: 'Tareas relacionadas con el trabajo' },
      { name: 'Personal', color: '#2ecc71', description: 'Tareas personales' },
      { name: 'Compras', color: '#e74c3c', description: 'Lista de compras' },
      { name: 'Salud', color: '#f39c12', description: 'Tareas de salud y ejercicio' }
    ];

    for (const category of sampleCategories) {
      await this.createCategory(category);
    }

    this.logger.info('Sample categories created');
  }
}
