import { http, HttpResponse } from 'msw';

import { API_BASE_URL, ROUTES, type Todo } from '@/constants';

const STORAGE_KEY = 'todos';

// Helper to get todos from localStorage
function getTodosFromStorage(): Todo[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Helper to save todos to localStorage
function saveTodosToStorage(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const todoHandlers = [
  // GET /api/todos
  http.get(`${API_BASE_URL}${ROUTES.TODOS}`, () => {
    const todos = getTodosFromStorage();
    return HttpResponse.json(todos);
  }),

  // POST /api/todos
  http.post(`${API_BASE_URL}${ROUTES.TODOS}`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };

    if (!title || title.trim() === '') {
      return HttpResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const todos = getTodosFromStorage();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
    };

    saveTodosToStorage([...todos, newTodo]);

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  // PATCH /api/todos/:id
  http.patch(
    `${API_BASE_URL}${ROUTES.TODOS}/:id`,
    async ({ request, params }) => {
      const { id } = params;
      const updates = (await request.json()) as Partial<
        Pick<Todo, 'title' | 'completed'>
      >;

      const todos = getTodosFromStorage();

      const todoIndex = todos.findIndex((t) => t.id === id);

      if (todoIndex === -1) {
        return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
      }

      const updatedTodo: Todo = {
        ...todos[todoIndex],
        ...updates,
      };

      todos[todoIndex] = updatedTodo;
      saveTodosToStorage(todos);

      return HttpResponse.json(updatedTodo);
    },
  ),

  // DELETE /api/todos/:id
  http.delete(`${API_BASE_URL}${ROUTES.TODOS}/:id`, ({ params }) => {
    const { id } = params;

    const todos = getTodosFromStorage();
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return HttpResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    todos.splice(todoIndex, 1);
    saveTodosToStorage(todos);

    return HttpResponse.json(null, { status: 204 });
  }),
];
