import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;
    const body = await request.json();
    const { status } = body || {};

    if (!status || !["pending", "completed"].includes(status)) {
      return Response.json(
        { error: "Valid status is required (pending or completed)" },
        { status: 400 },
      );
    }

    // Verify the task belongs to this user's client
    const taskRows = await sql`
      SELECT ct.id, ct.client_id
      FROM client_tasks ct
      JOIN clients c ON ct.client_id = c.id
      WHERE ct.id = ${taskId} AND c.user_id = ${userId}
      LIMIT 1
    `;

    if (taskRows.length === 0) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task status
    const completedAt =
      status === "completed" ? new Date().toISOString() : null;

    const result = await sql`
      UPDATE client_tasks 
      SET 
        status = ${status},
        completed_at = ${completedAt},
        updated_at = NOW()
      WHERE id = ${taskId}
      RETURNING id, status, completed_at, due_date, updated_at
    `;

    const updatedTask = result[0];
    return Response.json({ task: updatedTask });
  } catch (err) {
    console.error("PUT /api/tasks/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
