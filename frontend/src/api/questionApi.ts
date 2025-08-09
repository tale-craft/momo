// frontend/src/api/questionApi.ts
import apiClient, { ApiError } from "./apiClient";
import { Question } from "@/types";

/**
 * 向用户提交一个新问题。
 * @param token - 可选的 Clerk JWT，用于私密提问或记录提问者
 * @param questionData - 问题内容
 */
export const askQuestion = (
  token: string | null,
  questionData: {
    receiverHandle: string;
    content: string;
    isPrivate?: boolean;
    images?: string[];
  }
) => {
  return apiClient<{ questionId: string }>(`/questions`, token, {
    method: "POST",
    body: JSON.stringify(questionData),
  });
};

/**
 * [新增] 向一个对话添加回复。
 * @param token - Clerk JWT (可选，如果是公开问题可以为 null)
 * @param questionId - 对话的问题ID
 * @param replyData - 回复内容
 */
export const addQuestionReply = (
  token: string | null,
  questionId: string,
  replyData: {
    content: string;
    images?: string[];
  }
) => {
  return apiClient<{ success: boolean }>(
    `/questions/${questionId}/replies`,
    token,
    {
      method: "POST",
      body: JSON.stringify(replyData),
    }
  );
};

/**
 * 获取最近的公开问答流。
 */
export const getRecentQuestions = () => {
  return apiClient<{ questions: Question[] }>(`/questions/recent`, null, {
    method: "GET",
  });
};

/**
 * [修改] 获取单个问题的详细信息和完整对话。
 * @param token - 可选的 Clerk JWT，用于访问私密问题
 * @param questionId - 问题 ID
 */
export const getQuestionById = (token: string | null, questionId: string) => {
  return apiClient<{ question: Question }>(`/questions/${questionId}`, token, {
    method: "GET",
  });
};

/**
 * [修改] 获取当前登录用户的问题收件箱。
 * @param token - Clerk JWT (必须)
 * @param params - 筛选参数 { page, limit, status }
 */
export const getInboxQuestions = (
  token: string,
  params: {
    page?: number;
    limit?: number;
    status?: "all" | "pending" | "answered";
  }
) => {
  const { page = 1, limit = 20, status = "all" } = params;
  const url = `/questions/inbox?page=${page}&limit=${limit}&status=${status}`;
  return apiClient<{
    questions: Question[];
    pagination: { page: number; limit: number; total: number; status: string };
  }>(url, token, {
    method: "GET",
  });
};

/**
 * 获取当前登录用户的问题统计。
 * @param token - Clerk JWT (必须)
 */
export const getQuestionStats = (token: string) => {
  return apiClient<{
    stats: {
      total: number;
      pending: number;
      answered: number;
      private: number;
    };
  }>(`/questions/stats`, token, {
    method: "GET",
  });
};
