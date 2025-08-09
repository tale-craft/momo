export interface User {
  id: string;
  clerk_id: string;
  email: string;
  handle?: string;
  name: string;
  avatar_url?: string;
  avatar_type: "default_1" | "default_2" | "default_3" | "custom" | "google";
  created_at: string;
  updated_at: string;
}

export interface QuestionImage {
  id: string;
  question_id: string;
  image_url: string;
  type: "question";
  created_at: string;
}

export interface QuestionReplyImage {
  id: string;
  reply_id: string;
  image_url: string;
  created_at: string;
}

export interface QuestionReply {
  id: string;
  question_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  images?: QuestionReplyImage[];
  // 联表查询后附加的字段
  sender_name?: string;
  sender_avatar?: string;
}

export interface Question {
  id: string;
  receiver_id: string;
  asker_id?: string;
  content: string; // 这是初始问题
  is_private: boolean;
  created_at: string;
  last_reply_at: string;

  // 联表查询后附加的字段
  images?: QuestionImage[];
  replies?: QuestionReply[]; // 存储整个对话
  viewer_permission?: "receiver" | "asker" | "visitor"; // 新增权限标识

  // 附加的用户信息
  receiver_name?: string;
  receiver_handle?: string;
  receiver_avatar?: string;
  asker_name?: string;
  asker_handle?: string;
  asker_avatar?: string;
}

export interface BottleImage {
  id: string;
  message_id: string;
  image_url: string;
  created_at: string;
}

export interface BottleMessage {
  id: string;
  bottle_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  images?: BottleImage[];
  sender_name?: string;
  sender_avatar?: string;
}

export interface Bottle {
  id: string;
  creator_id: string;
  picker_id?: string;
  status: "floating" | "picked" | "replied";
  picked_at?: string;
  created_at: string;
  messages?: BottleMessage[];
  creator_name?: string;
  creator_avatar?: string;
  picker_name?: string;
  picker_avatar?: string;
}

// 用于分页的通用类型
export interface PaginatedResponse<T> {
  questions: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
