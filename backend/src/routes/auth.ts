import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { DatabaseService } from "../services/db";
import type { Env } from "../types";

const app = new Hono<{ Bindings: Env }>();

app.post("/callback", async (c) => {
  const { userId, email, imageUrl, firstName, lastName, provider } =
    await c.req.json();

  const db = new DatabaseService(c.env.DB);
  let user = await db.getUserByClerkId(userId);

  if (!user) {
    const name =
      provider === "google" && firstName
        ? `${firstName} ${lastName || ""}`.trim()
        : "momo";
    const avatarUrl = provider === "google" && imageUrl ? imageUrl : undefined;
    const avatarType = provider === "google" && imageUrl ? "google" : undefined;

    user = await db.createUser(userId, email, name);

    if (avatarUrl) {
      await db.updateUser(user.id, {
        avatar_url: avatarUrl,
        avatar_type: avatarType,
      });
    }
  }

  return c.json({ user });
});

app.get("/me", requireAuth, async (c) => {
  const clerkId = c.get("userId");
  if (!clerkId || typeof clerkId !== "string") {
    return c.json({ error: "Authentication context is invalid" }, 500);
  }
  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ user });
});

app.put("/profile", requireAuth, async (c) => {
  const clerkId = c.get("userId");
  if (!clerkId || typeof clerkId !== "string") {
    return c.json({ error: "Authentication context is invalid" }, 500);
  }
  const { handle, name, avatarUrl, avatarType } = await c.req.json();

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查 handle 是否已被占用
  if (handle && handle !== user.handle) {
    const existing = await db.getUserByHandle(handle);
    if (existing) {
      return c.json({ error: "Handle already taken" }, 400);
    }
  }

  const updatedUser = await db.updateUser(user.id, {
    handle,
    name,
    avatar_url: avatarUrl,
    avatar_type: avatarType,
  });

  return c.json({ user: updatedUser });
});

export default app;
