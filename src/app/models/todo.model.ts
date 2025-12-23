export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
}
