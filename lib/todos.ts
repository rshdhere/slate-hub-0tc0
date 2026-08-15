export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __todos?: Todo[];
};

function store(): Todo[] {
  if (!globalStore.__todos) {
    globalStore.__todos = [
      {
        id: crypto.randomUUID(),
        title: "Plan the week",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Ship the Next.js todo app",
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return globalStore.__todos;
}

export function listTodos(): Todo[] {
  return [...store()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  store().unshift(todo);
  return todo;
}

export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "completed">>,
): Todo | null {
  const todos = store();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const current = todos[index];
  const next: Todo = {
    ...current,
    ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
    ...(patch.completed !== undefined ? { completed: patch.completed } : {}),
  };
  todos[index] = next;
  return next;
}

export function deleteTodo(id: string): boolean {
  const todos = store();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
