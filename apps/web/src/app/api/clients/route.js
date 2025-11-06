import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows = await sql`
      SELECT id, user_id, business_type, business_name, created_at, updated_at 
      FROM clients 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    const client = rows?.[0] || null;
    return Response.json({ client });
  } catch (err) {
    console.error("GET /api/clients error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { business_type, business_name } = body || {};

    if (!business_type || !business_name) {
      return Response.json(
        { error: "business_type and business_name are required" },
        { status: 400 },
      );
    }

    // Check if client already exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE user_id = ${userId} LIMIT 1
    `;

    if (existingClient.length > 0) {
      return Response.json(
        { error: "Client already exists for this user" },
        { status: 400 },
      );
    }

    // Create new client
    const result = await sql`
      INSERT INTO clients (user_id, business_type, business_name)
      VALUES (${userId}, ${business_type}, ${business_name})
      RETURNING id, user_id, business_type, business_name, created_at, updated_at
    `;

    const client = result[0];

    // Create initial tasks for this client based on their business type
    const templateTasks = await sql`
      SELECT id, title, description, due_date 
      FROM tasks 
      WHERE business_type = ${business_type} AND is_template = true
    `;

    // Generate tasks for the current month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (const task of templateTasks) {
      const taskDueDate = new Date(task.due_date);
      const adjustedDueDate = new Date(
        currentYear,
        currentMonth,
        taskDueDate.getDate(),
      );

      await sql`
        INSERT INTO client_tasks (client_id, task_id, due_date)
        VALUES (${client.id}, ${task.id}, ${adjustedDueDate.toISOString().split("T")[0]})
      `;
    }

    return Response.json({ client });
  } catch (err) {
    console.error("POST /api/clients error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
