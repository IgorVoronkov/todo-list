import { TodoList } from './TodoList';

import { QueryProvider } from '@/providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <div>
        <h1>My Todo App</h1>
        <TodoList />
      </div>
    </QueryProvider>
  );
}

export default App;
