/**
 * Category Model
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
  description?: string;
}
