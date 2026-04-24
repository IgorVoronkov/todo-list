import { useState } from 'react';

import { useTodos } from './useTodos';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const {
    todos,
    isLoading,
    isSubmitting,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  const handleAddTodo = () => {
    addTodo(newTodoTitle).then(() => {
      setNewTodoTitle('');
    });
  };

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div>
      <h2>Todo List</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <input
          type="text"
          placeholder="Enter a new todo..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
          disabled={isSubmitting}
        />
        <button onClick={handleAddTodo} disabled={isSubmitting}>
          ADD
        </button>
      </div>

      {todos.length === 0 ? (
        <p>No todos yet. Add one to get started!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                disabled={isSubmitting}
              />
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                disabled={isSubmitting}
              >
                DELETE
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
