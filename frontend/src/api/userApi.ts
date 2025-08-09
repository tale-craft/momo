// src/api/userApi.ts
import apiClient from './apiClient';
import { User, Question } from '@/types';

/**
 * 获取用户的公开个人资料。
 * @param handle - 用户的 handle
 */
export const getPublicProfileByHandle = (handle: string) => {
  return apiClient<{ user: Partial<User> }>(`/users/${handle}`, null, {
    method: 'GET',
  });
};

/**
 * 获取用户的问题列表（带分页）。
 * 根据用户是否登录（是否提供 token），后端会返回不同范围的数据。
 * @param handle - 用户的 handle
 * @param token - 可选的 Clerk JWT，用于查看私密问题
 * @param page - 页码
 * @param limit - 每页数量
 */
export const getUserQuestions = (
  handle: string, 
  token: string | null, 
  page = 1, 
  limit = 20
) => {
  const url = `/users/${handle}/questions?page=${page}&limit=${limit}`;
  return apiClient<{ 
    questions: Question[],
    pagination: { page: number; limit: number; total: number } 
  }>(url, token, {
    method: 'GET',
  });
};