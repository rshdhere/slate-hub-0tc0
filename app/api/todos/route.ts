import { NextResponse } from "next/server";
import { createTodo, listTodos } from "@/lib/todos";

export function GET() {
  return NextResponse.json({ todos: listTodos() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title =
    typeof body === "object" &&
    body !== null &&
    "title" in body &&
    typeof (body as { title: unknown }).title === "string"
      ? (body as { title: string }).title
      : "";

  if (!title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const todo = createTodo(title);
  return NextResponse.json({ todo }, { status: 201 });
}
