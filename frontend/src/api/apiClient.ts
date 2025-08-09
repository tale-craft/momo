import { User, Question, Bottle } from "@/types";

/**
 * 自定义错误类，用于更好地传递来自 API 的错误信息。
 */
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 中心化的 API 请求函数。
 * @param endpoint - API 路径 (例如: '/users/profile')
 * @param token - Clerk 生成的 JWT
 * @param options - Fetch API 的选项 (method, body, etc.)
 * @returns - 解析后的 JSON 响应
 * @throws {ApiError} - 当 API 返回非 2xx 状态码时抛出
 */
async function apiClient<T>(
  endpoint: string, 
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: 'An unknown error occurred' };
    }
    throw new ApiError(
      errorData.error || `HTTP error! status: ${response.status}`, 
      response.status,
      errorData.details
    );
  }

  // 对 204 No Content 等情况进行处理
  if (response.status === 204) {
      return {} as T;
  }

  return response.json() as Promise<T>;
}

export default apiClient;