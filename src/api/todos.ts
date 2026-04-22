import { request } from './helper';

import { type Todo, ROUTES } from '@/constants';

export const getTodos = () => request<Todo[]>(ROUTES.TODOS);

export const createTodo = (title: string) =>
  request<Todo>(ROUTES.TODOS, {
    method: 'POST',
    body: { title },
  });

type TodoUpdates = Partial<Pick<Todo, 'title' | 'completed'>>;

export const updateTodo = (id: string, updates: TodoUpdates) =>
  request<Todo>(`${ROUTES.TODOS}/${id}`, {
    method: 'PATCH',
    body: updates,
  });

export const deleteTodo = (id: string) =>
  request<undefined>(`${ROUTES.TODOS}/${id}`, {
    method: 'DELETE',
  });
