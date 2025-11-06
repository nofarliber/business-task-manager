import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get the client for this user
    const clientRows = await sql`
      SELECT id FROM clients WHERE user_id = ${userId} LIMIT 1
    `;

    if (clientRows.length === 0) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    const clientId = clientRows[0].id;

    // Get all tasks for this client with task details
    const tasks = await sql`
      SELECT 
        ct.id,
        ct.status,
        ct.completed_at,
        ct.due_date,
        ct.created_at,
        ct.updated_at,
        t.title,
        t.description,
        t.business_type
      FROM client_tasks ct
      JOIN tasks t ON ct.task_id = t.id
      WHERE ct.client_id = ${clientId}
      ORDER BY ct.due_date ASC, ct.created_at ASC
    `;

    return Response.json({ tasks });
  } catch (err) {
    console.error("GET /api/tasks error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
