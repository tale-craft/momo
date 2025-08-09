// src/api/bottleApi.ts
import apiClient from './apiClient';
import { Bottle } from '@/types';

/**
 * 创建一个新的漂流瓶。
 * @param token - Clerk JWT
 * @param messageData - 漂流瓶的初始消息
 */
export const createBottle = (token: string, messageData: {
  content: string;
  images?: string[];
}) => {
  return apiClient<{ bottleId: string }>(`/bottles`, token, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

/**
 * 捡一个漂流瓶。
 * @param token - Clerk JWT
 */
export const pickBottle = (token: string) => {
  return apiClient<{ bottle: Bottle }>(`/bottles/pick`, token, {
    method: 'GET', // 注意：虽然是操作，但后端定义为 GET 更符合 '捡' 的语义
  });
};

/**
 * 获取我的所有漂流瓶列表。
 * @param token - Clerk JWT
 */
export const getMyBottles = (token: string) => {
  return apiClient<{ bottles: Bottle[] }>(`/bottles/my`, token, {
    method: 'GET',
  });
};

/**
 * 获取单个漂流瓶的详细信息和对话历史。
 * @param token - Clerk JWT
 * @param bottleId - 漂流瓶 ID
 */
export const getBottleDetails = (token: string, bottleId: string) => {
  return apiClient<{ bottle: Bottle }>(`/bottles/${bottleId}`, token, {
    method: 'GET',
  });
};

/**
 * 在漂流瓶中发送一条新消息。
 * @param token - Clerk JWT
 * @param bottleId - 漂流瓶 ID
 * @param messageData - 消息内容
 */
export const sendBottleMessage = (token: string, bottleId: string, messageData: {
  content: string;
  images?: string[];
}) => {
  return apiClient<{ messageId: string }>(`/bottles/${bottleId}/messages`, token, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

/**
 * 释放（扔回海里）一个捡到的漂流瓶。
 * @param token - Clerk JWT
 * @param bottleId - 漂流瓶 ID
 */
export const releaseBottle = (token: string, bottleId: string) => {
    return apiClient<{ success: boolean }>(`/bottles/${bottleId}/release`, token, {
        method: 'PUT',
    });
};