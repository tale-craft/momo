import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { DatabaseService } from "../services/db";
import { EmailService } from "../services/email";
import { generateId } from "../utils/helpers";
import { bottleMessageSchema } from "../utils/validators";
import type { Env } from "../types";

const app = new Hono<{ Bindings: Env }>();

// 创建新漂流瓶
app.post("/", requireAuth, async (c) => {
  const clerkId = c.get("userId");
  const body = await c.req.json();

  const validated = bottleMessageSchema.safeParse(body);
  if (!validated.success) {
    return c.json({ error: "Invalid input" }, 400);
  }

  const { content, images = [] } = validated.data;

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查是否有未完成的漂流瓶
  const activePick = await c.env.DB.prepare(
    `SELECT * FROM bottles WHERE picker_id = ? AND status = 'picked'`
  )
    .bind(user.id)
    .first();

  if (activePick) {
    return c.json({ error: "Please finish your current bottle first" }, 400);
  }

  // 创建漂流瓶
  const bottleId = generateId();
  await c.env.DB.prepare(
    `INSERT INTO bottles (id, creator_id, status) VALUES (?, ?, 'floating')`
  )
    .bind(bottleId, user.id)
    .run();

  // 创建第一条消息
  const messageId = generateId();
  await c.env.DB.prepare(
    `INSERT INTO bottle_messages (id, bottle_id, sender_id, content) VALUES (?, ?, ?, ?)`
  )
    .bind(messageId, bottleId, user.id, content)
    .run();

  // 保存图片
  for (const imageUrl of images) {
    await c.env.DB.prepare(
      `INSERT INTO bottle_images (id, message_id, image_url) VALUES (?, ?, ?)`
    )
      .bind(generateId(), messageId, imageUrl)
      .run();
  }

  return c.json({ bottleId });
});

// 获取我的漂流瓶
app.get("/my", requireAuth, async (c) => {
  const clerkId = c.get("userId");

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const bottles = await c.env.DB.prepare(
    `SELECT b.*, 
            u1.name as creator_name, u1.avatar_url as creator_avatar,
            u2.name as picker_name, u2.avatar_url as picker_avatar
     FROM bottles b
     JOIN users u1 ON b.creator_id = u1.id
     LEFT JOIN users u2 ON b.picker_id = u2.id
     WHERE b.creator_id = ? OR b.picker_id = ?
     ORDER BY b.created_at DESC`
  )
    .bind(user.id, user.id)
    .all();

  return c.json({ bottles: bottles.results });
});

// 获取统计信息
app.get("/stats", async (c) => {
  const stats = await c.env.DB.prepare(
    `SELECT 
      COUNT(CASE WHEN status = 'floating' THEN 1 END) as floating_count,
      COUNT(CASE WHEN status = 'picked' THEN 1 END) as picked_count,
      COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_count,
      COUNT(*) as total_count
     FROM bottles`
  ).first();

  return c.json({ stats });
});

// 捡一个漂流瓶
app.get("/pick", requireAuth, async (c) => {
  const clerkId = c.get("userId");

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查是否已经有在处理的漂流瓶
  const activePick = await c.env.DB.prepare(
    `SELECT * FROM bottles WHERE picker_id = ? AND status = 'picked'`
  )
    .bind(user.id)
    .first();

  if (activePick) {
    return c.json(
      { error: "You already have an active bottle", bottleId: activePick.id },
      400
    );
  }

  // 随机选择一个漂流瓶
  const bottle = await c.env.DB.prepare(
    `SELECT * FROM bottles 
     WHERE status = 'floating' AND creator_id != ?
     ORDER BY RANDOM() LIMIT 1`
  )
    .bind(user.id)
    .first();

  if (!bottle) {
    return c.json({ error: "No bottles available" }, 404);
  }

  // 更新漂流瓶状态
  await c.env.DB.prepare(
    `UPDATE bottles SET picker_id = ?, status = 'picked', picked_at = CURRENT_TIMESTAMP 
     WHERE id = ?`
  )
    .bind(user.id, bottle.id)
    .run();

  // 获取漂流瓶详情
  const bottleData = await getBottleDetails(c.env.DB, bottle.id);

  return c.json({ bottle: bottleData });
});

// 释放漂流瓶（换一个）
app.put("/:id/release", requireAuth, async (c) => {
  const bottleId = c.req.param("id");
  const clerkId = c.get("userId");

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查是否是当前拾取者
  const bottle = await c.env.DB.prepare(
    `SELECT * FROM bottles WHERE id = ? AND picker_id = ? AND status = 'picked'`
  )
    .bind(bottleId, user.id)
    .first();

  if (!bottle) {
    return c.json({ error: "Bottle not found or access denied" }, 404);
  }

  // 释放漂流瓶
  await c.env.DB.prepare(
    `UPDATE bottles SET picker_id = NULL, status = 'floating', picked_at = NULL 
     WHERE id = ?`
  )
    .bind(bottleId)
    .run();

  return c.json({ success: true });
});

// 发送消息
app.post("/:id/messages", requireAuth, async (c) => {
  const bottleId = c.req.param("id");
  const clerkId = c.get("userId");
  const body = await c.req.json();

  const validated = bottleMessageSchema.safeParse(body);
  if (!validated.success) {
    return c.json({ error: "Invalid input" }, 400);
  }

  const { content, images = [] } = validated.data;

  const db = new DatabaseService(c.env.DB);
  const emailService = new EmailService(c.env);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查权限
  const bottle = await c.env.DB.prepare(
    `SELECT * FROM bottles WHERE id = ? AND (creator_id = ? OR picker_id = ?)`
  )
    .bind(bottleId, user.id, user.id)
    .first();

  if (!bottle) {
    return c.json({ error: "Bottle not found or access denied" }, 404);
  }

  // 创建消息
  const messageId = generateId();
  await c.env.DB.prepare(
    `INSERT INTO bottle_messages (id, bottle_id, sender_id, content) VALUES (?, ?, ?, ?)`
  )
    .bind(messageId, bottleId, user.id, content)
    .run();

  // 保存图片
  for (const imageUrl of images) {
    await c.env.DB.prepare(
      `INSERT INTO bottle_images (id, message_id, image_url) VALUES (?, ?, ?)`
    )
      .bind(generateId(), messageId, imageUrl)
      .run();
  }

  // 更新漂流瓶状态
  if (bottle.status === "picked" && bottle.picker_id === user.id) {
    await c.env.DB.prepare(`UPDATE bottles SET status = 'replied' WHERE id = ?`)
      .bind(bottleId)
      .run();
  }

  // 发送邮件通知
  const recipientId =
    bottle.creator_id === user.id ? bottle.picker_id : bottle.creator_id;
  if (recipientId) {
    const recipient = await db.getUserById(recipientId);
    if (recipient) {
      await emailService.queueEmail({
        recipient: recipient.email,
        type: "bottle_replied",
        payload: {
          bottleId,
          senderName: user.name,
          content,
        },
      });
    }
  }

  return c.json({ messageId });
});

// 获取漂流瓶详情
app.get("/:id", requireAuth, async (c) => {
  const bottleId = c.req.param("id");
  const clerkId = c.get("userId");

  const db = new DatabaseService(c.env.DB);
  const user = await db.getUserByClerkId(clerkId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // 检查权限
  const bottle = await c.env.DB.prepare(
    `SELECT * FROM bottles WHERE id = ? AND (creator_id = ? OR picker_id = ?)`
  )
    .bind(bottleId, user.id, user.id)
    .first();

  if (!bottle) {
    return c.json({ error: "Bottle not found or access denied" }, 404);
  }

  const bottleData = await getBottleDetails(c.env.DB, bottleId);

  return c.json({ bottle: bottleData });
});

// 辅助函数：获取漂流瓶详情
async function getBottleDetails(db: D1Database, bottleId: string) {
  const bottle = await db
    .prepare(
      `SELECT b.*, 
            u1.name as creator_name, u1.avatar_url as creator_avatar,
            u2.name as picker_name, u2.avatar_url as picker_avatar
     FROM bottles b
     JOIN users u1 ON b.creator_id = u1.id
     LEFT JOIN users u2 ON b.picker_id = u2.id
     WHERE b.id = ?`
    )
    .bind(bottleId)
    .first();

  if (!bottle) return null;

  // 获取消息
  const messages = await db
    .prepare(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
     FROM bottle_messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.bottle_id = ?
     ORDER BY m.created_at`
    )
    .bind(bottleId)
    .all();

  // 获取每条消息的图片
  const messagesWithImages = await Promise.all(
    messages.results.map(async (msg: any) => {
      const images = await db
        .prepare("SELECT * FROM bottle_images WHERE message_id = ?")
        .bind(msg.id)
        .all();

      return {
        ...msg,
        images: images.results,
      };
    })
  );

  return {
    ...bottle,
    messages: messagesWithImages,
  };
}

export default app;
