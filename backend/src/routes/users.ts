// momo/backend/src/routes/users.ts
import { Hono } from "hono";
import { optionalAuth } from "../middleware/auth";
import { DatabaseService } from "../services/db";
import type { Env } from "../types";

const app = new Hono<{ Bindings: Env }>();

app.get("/:handle", async (c) => {
  const handle = c.req.param("handle");
  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByHandle(handle);
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json({
    user: {
      id: user.id,
      handle: user.handle,
      name: user.name,
      avatar_url: user.avatar_url,
      avatar_type: user.avatar_type,
    },
  });
});

app.get("/:handle/questions", optionalAuth, async (c) => {
  const handle = c.req.param("handle");
  const clerkId = c.get("userId");
  const { page = 1, limit = 20 } = c.req.query();
  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByHandle(handle);
  if (!user) return c.json({ error: "User not found" }, 404);
  const currentUser = clerkId ? await db.getUserByClerkId(clerkId) : null;
  const isOwner = currentUser?.id === user.id;

  let listQuery = `SELECT q.*, COALESCE(asker.name, 'Anonymous') as asker_name, asker.handle as asker_handle, asker.avatar_url as asker_avatar FROM questions q LEFT JOIN users asker ON q.asker_id = asker.id WHERE q.receiver_id = ?`;
  let countQuery = `SELECT COUNT(*) as total FROM questions q WHERE q.receiver_id = ?`;
  const params: (string | number)[] = [user.id];

  if (!isOwner) {
    const condition = ` AND q.is_private = 0`;
    listQuery += condition;
    countQuery += condition;
  }

  listQuery += " ORDER BY q.last_reply_at DESC LIMIT ? OFFSET ?";
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  params.push(parseInt(limit as string), offset);

  const listResult = await c.env.DB.prepare(listQuery)
    .bind(...params)
    .all();
  const countResult = await c.env.DB.prepare(countQuery)
    .bind(user.id)
    .first<{ total: number }>();

  return c.json({
    questions: listResult.results || [],
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: countResult?.total || 0,
    },
  });
});

export default app;
