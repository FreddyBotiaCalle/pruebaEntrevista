/**
 * Modelo genérico para respuestas de API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: Date;
}

/**
 * Modelo para paginación
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Modelo para filtros
 */
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
