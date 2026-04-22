export const API_BASE_URL = '/api';

export const ROUTES = {
  TODOS: '/todos',
} as const;

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
