import { useState, useEffect } from 'react';

import {
  getTodos,
  createTodo,
  deleteTodo as removeTodo,
  updateTodo,
} from '@/api/todos';
import { type Todo } from '@/constants';

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAsync<T>(
    fn: () => Promise<T>,
    setLoading: (value: boolean) => void,
  ): Promise<T | undefined> {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async function fetchTodos() {
      const fetchedTodos = await runAsync<Todo[]>(getTodos, setIsLoading);
      if (fetchedTodos) {
        setTodos(fetchedTodos);
      }
    })();
  }, []);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Todo title cannot be empty');
      return;
    }
    const newTodo = await runAsync<Todo>(
      () => createTodo(title),
      setIsSubmitting,
    );
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  };

  const deleteTodo = async (id: string) => {
    runAsync<void>(() => removeTodo(id), setIsSubmitting).then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    });
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const updatedTodo = await runAsync<Todo>(
      () => updateTodo(id, { completed: !completed }),
      setIsSubmitting,
    );
    if (updatedTodo) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    }
  };

  return {
    todos,
    isLoading,
    isSubmitting,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
}
