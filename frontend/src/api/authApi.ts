// src/api/authApi.ts
import apiClient from './apiClient';
import { User } from '@/types'; // 确保你的类型定义文件路径正确

/**
 * 当 Clerk 登录/注册成功后，调用此接口在我们的数据库中创建或同步用户。
 * @param token - Clerk JWT
 * @param userData - 从 Clerk useUser() hook 获取的用户信息
 */
export const syncUser = (token: string, userData: { 
  userId: string;
  email: string;
  imageUrl?: string;
  firstName?: string | null;
  lastName?: string | null;
  provider?: string; // e.g. 'google.com'
}) => {
  return apiClient<{ user: User }>(`/auth/callback`, token, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * 获取当前登录用户的完整个人资料（包含私有信息）。
 * @param token - Clerk JWT
 */
export const getMyProfile = (token: string) => {
  return apiClient<{ user: User }>(`/auth/me`, token, {
    method: 'GET',
  });
};

/**
 * 更新当前登录用户的个人资料。
 * @param token - Clerk JWT
 * @param profileData - 要更新的字段
 */
export const updateMyProfile = (token: string, profileData: {
  handle?: string;
  name?: string;
  avatarUrl?: string;
  avatarType?: string;
}) => {
  return apiClient<{ user: User }>(`/auth/profile`, token, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};