export const APP_CONSTANTS = {
  APP_NAME: 'TODO App',
  APP_VERSION: '1.0.0',
  STORAGE_KEY: 'todos',
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_TITLE_LENGTH: 3,
  DEBOUNCE_TIME: 300,
  TOAST_DURATION: 2000,
};

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ALL = 'all',
}

export enum SortBy {
  DATE_CREATED = 'createdAt',
  DATE_UPDATED = 'updatedAt',
  DATE_DUE = 'dueDate',
  TITLE = 'title',
  STATUS = 'completed',
}

export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error inesperado',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION: 'Los datos proporcionados no son válidos',
  NETWORK: 'Error de conexión',
  STORAGE: 'Error al acceder al almacenamiento',
};

export const SUCCESS_MESSAGES = {
  CREATE: 'Tarea creada correctamente',
  UPDATE: 'Tarea actualizada correctamente',
  DELETE: 'Tarea eliminada correctamente',
  TOGGLE: 'Estado de la tarea actualizado',
  CLEAR_COMPLETED: 'Tareas completadas eliminadas',
};
