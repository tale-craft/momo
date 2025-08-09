import { Hono } from "hono";
import { cors } from "./middleware/cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import questionRoutes from "./routes/questions";
import bottleRoutes from "./routes/bottles";
import uploadRoutes from "./routes/upload";
import { processEmailQueue } from "./services/email";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// 中间件
app.use("/*", cors);

// 路由
app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/questions", questionRoutes);
app.route("/api/bottles", bottleRoutes);
app.route("/api/upload", uploadRoutes);
// 添加一个临时的调试路由
app.get("/debug-env", (c) => {
  // 返回所有环境变量的键名，这样不会暴露 Secret 的值
  // 或者在本地开发时，可以直接返回整个 env 对象
  console.log(c.env);
  return c.json({
    message: "Available environment variable keys",
    keys: Object.keys(c.env),
  });
});

// 健康检查
app.get("/health", (c) => c.json({ status: "ok" }));

// Cron 任务处理
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(processEmailQueue(env));
    ctx.waitUntil(releaseExpiredBottles(env));
  },
};

// 释放过期的漂流瓶
async function releaseExpiredBottles(env: Env) {
  const twelveHoursAgo = new Date(
    Date.now() - 12 * 60 * 60 * 1000
  ).toISOString();

  await env.DB.prepare(
    `UPDATE bottles 
     SET status = 'floating', picker_id = NULL, picked_at = NULL 
     WHERE status = 'picked' AND picked_at < ?`
  )
    .bind(twelveHoursAgo)
    .run();
}
