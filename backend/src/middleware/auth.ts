import { Context, Next } from "hono";
import { createClerkClient } from "@clerk/backend";
import type { SessionAuthObject } from "@clerk/backend";
import { env } from "hono/adapter";
import type { Env as AppEnv } from "../types"; // 导入您应用的环境变量类型

// 为Clerk相关的环境变量定义一个类型，增强类型安全
type ClerkAuthEnv = {
  CLERK_SECRET_KEY: string;
};

// 定义将要设置到上下文中的 auth 对象类型
export type AuthObject = SessionAuthObject | null;

/**
 * 认证必需中间件 (requireAuth)
 * 如果用户未认证，则返回 401 Unauthorized 错误。
 */
export async function requireAuth(
  c: Context<{ Bindings: AppEnv & ClerkAuthEnv }>,
  next: Next
) {
  const clerkClient = createClerkClient({ secretKey: c.env.CLERK_SECRET_KEY });

  try {
    const requestState = await clerkClient.authenticateRequest(c.req.raw, {
      isSatellite: true,
      domain: "momo.lyle.im",
      proxyUrl: "https://clerk.lyle.im",
      secretKey: c.env.CLERK_SECRET_KEY,
      publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    });

    const auth = requestState.toAuth();
    console.log("Authenticated user:", auth);
    if (!auth.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", auth?.userId);
    await next();
  } catch (error) {
    console.error("Clerk authentication error:", error);
    return c.json({ error: "Invalid token or authentication error" }, 401);
  }
}

/**
 * 认证可选中间件 (optionalAuth)
 * 无论用户是否认证，都会继续处理请求。
 * 如果已认证，则会将 auth 对象设置到上下文中。
 */
export async function optionalAuth(
  c: Context<{ Bindings: AppEnv & ClerkAuthEnv }>,
  next: Next
) {
  const clerkClient = createClerkClient({ secretKey: c.env.CLERK_SECRET_KEY });

  try {
    const requestState = await clerkClient.authenticateRequest(c.req.raw, {
      isSatellite: true,
      domain: "momo.lyle.im",
      proxyUrl: "https://clerk.lyle.im",
      secretKey: c.env.CLERK_SECRET_KEY,
      publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    });

    const auth = requestState.toAuth();
    console.log("Authenticated user:", auth);
    if (!auth.userId) {
      c.set("userId", null);
      console.warn(
        "Optional authentication failed, user is not authenticated."
      );
    }

    c.set("userId", auth?.userId);
  } catch (error) {
    c.set("userId", null);
    console.warn("Optional authentication failed, user is not authenticated.");
  }
  await next();
}
