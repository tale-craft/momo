export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  FRONTEND_URL: string;
  EMAIL_FROM: string;
  EMAIL_API_KEY: string;
  IP_SALT: string;
}

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
  type: "question"; // 'answer' type is deprecated
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
  // Joined fields
  sender_name?: string;
  sender_avatar?: string;
}

export interface Question {
  id: string;
  receiver_id: string;
  asker_id?: string;
  asker_ip_hash?: string;
  content: string;
  is_private: boolean;
  created_at: string;
  last_reply_at: string;
  // Joined fields
  images?: QuestionImage[];
  replies?: QuestionReply[];
  receiver?: Partial<User>;
  asker?: Partial<User>;
  // For API response
  viewer_permission?: "receiver" | "asker" | "visitor";
}

export interface Bottle {
  id: string;
  creator_id: string;
  picker_id?: string;
  status: "floating" | "picked" | "replied";
  picked_at?: string;
  created_at: string;
  messages?: BottleMessage[];
  creator?: User;
  picker?: User;
}

export interface BottleMessage {
  id: string;
  bottle_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  images?: any[];
  sender?: User;
}

export interface EmailQueueItem {
  id: string;
  recipient_email: string;
  type:
    | "question_received"
    | "question_answered"
    | "bottle_replied"
    | "verification";
  payload: string;
  status: "pending" | "sent" | "failed";
  created_at: string;
  sent_at?: string;
}
