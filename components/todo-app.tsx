"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import type { Todo } from "@/lib/todos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "completed";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to load todos");
      const data = (await res.json()) as { todos: Todo[] };
      setTodos(data.todos);
      setError(null);
    } catch {
      setError("Could not load your list. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.completed).length;

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("create failed");
      const data = (await res.json()) as { todo: Todo };
      setTodos((prev) => [data.todo, ...prev]);
      setTitle("");
      setError(null);
    } catch {
      setError("Could not add that task.");
    } finally {
      setPending(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t,
      ),
    );
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t,
        ),
      );
      setError("Could not update that task.");
    }
  }

  async function removeTodo(id: string) {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
    } catch {
      setTodos(snapshot);
      setError("Could not delete that task.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--color-accent)]">
          Slate Hub
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Todo List
        </h1>
        <p className="mt-2 text-base text-[var(--color-ink-muted)]">
          Capture tasks, check them off, and keep momentum.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 shadow-[0_12px_40px_-24px_rgba(12,18,34,0.35)] sm:p-6">
        <form onSubmit={addTodo} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            aria-label="New todo"
            maxLength={200}
            autoFocus
          />
          <Button type="submit" disabled={pending || !title.trim()} aria-label="Add todo">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
          <p className="text-sm text-[var(--color-ink-muted)]">
            {loading
              ? "Loading…"
              : `${remaining} remaining · ${todos.length} total`}
          </p>
          <div className="flex gap-1 rounded-lg bg-[var(--color-surface)] p-1">
            {(["all", "active", "completed"] as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm capitalize transition-colors",
                  filter === key
                    ? "bg-[var(--color-panel)] font-medium text-[var(--color-ink)] shadow-sm"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-[var(--color-danger-soft)] px-3 py-2 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <ul className="mt-2 divide-y divide-[var(--color-line)]" aria-live="polite">
          {loading ? (
            <li className="py-8 text-center text-sm text-[var(--color-ink-muted)]">
              Loading your tasks…
            </li>
          ) : filtered.length === 0 ? (
            <li className="py-10 text-center">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                {filter === "all"
                  ? "Add something above to get started."
                  : "Try another filter or add a new task."}
              </p>
            </li>
          ) : (
            filtered.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 py-3.5"
              >
                <button
                  type="button"
                  onClick={() => void toggleTodo(todo)}
                  aria-label={
                    todo.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                    todo.completed
                      ? "border-[var(--color-done)] bg-[var(--color-done)] text-white"
                      : "border-[var(--color-line)] bg-[var(--color-panel)] hover:border-[var(--color-accent)]",
                  )}
                >
                  {todo.completed ? <Check className="h-3.5 w-3.5" /> : null}
                </button>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[15px] leading-snug",
                    todo.completed &&
                      "text-[var(--color-ink-muted)] line-through",
                  )}
                >
                  {todo.title}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void removeTodo(todo.id)}
                  aria-label={`Delete ${todo.title}`}
                  className="opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
