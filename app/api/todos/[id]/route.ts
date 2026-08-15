import { NextResponse } from "next/server";
import { deleteTodo, updateTodo } from "@/lib/todos";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: { title?: string; completed?: boolean } = {};
  if (typeof body === "object" && body !== null) {
    const record = body as Record<string, unknown>;
    if (typeof record.title === "string") patch.title = record.title;
    if (typeof record.completed === "boolean") patch.completed = record.completed;
  }

  if (patch.title !== undefined && !patch.title.trim()) {
    return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
  }

  const todo = updateTodo(id, patch);
  if (!todo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ todo });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const ok = deleteTodo(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
