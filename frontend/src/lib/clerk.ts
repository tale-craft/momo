// src/lib/clerk.ts

// 这是一个放置 Clerk 相关配置或辅助函数的地方。
// 例如，你可以定义一个函数来从Clerk user对象中提取我们后端需要的特定信息。

import { UserResource } from "@clerk/types";

/**
 * 格式化 Clerk user 对象以匹配我们后端 /auth/callback 端点的期望。
 * @param user - 从 Clerk 的 useUser() hook 获取的 UserResource 对象。
 * @returns 格式化后的对象，准备发送到后端。
 */
export function formatUserForBE(user: UserResource | null | undefined) {
  if (!user) return null;

  // Clerk 的 provider 字符串通常是 'oauth_google' 等，我们只取 'google' 部分。
  const provider = user.externalAccounts[0]?.provider.replace('oauth_', '');

  return {
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    provider: provider,
  };
}