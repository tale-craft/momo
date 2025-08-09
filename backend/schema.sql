-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  handle TEXT UNIQUE,
  name TEXT DEFAULT 'momo',
  avatar_url TEXT,
  avatar_type TEXT CHECK (avatar_type IN ('default_1', 'default_2', 'default_3', 'custom', 'google')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 问题表
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  receiver_id TEXT NOT NULL,
  asker_id TEXT,
  asker_ip_hash TEXT,
  content TEXT NOT NULL,
  is_private INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_reply_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (asker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 问题回复表
CREATE TABLE IF NOT EXISTS question_replies (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  sender_id TEXT, 
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS question_images (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT CHECK (type IN ('question')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_reply_images (
  id TEXT PRIMARY KEY,
  reply_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reply_id) REFERENCES question_replies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bottles (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  picker_id TEXT,
  status TEXT DEFAULT 'floating' CHECK (status IN ('floating', 'picked', 'replied')),
  picked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (picker_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bottle_messages (
  id TEXT PRIMARY KEY,
  bottle_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bottle_images (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES bottle_messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_queue (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_questions_receiver ON questions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_questions_asker ON questions(asker_id);
CREATE INDEX IF NOT EXISTS idx_questions_last_reply_at ON questions(last_reply_at);
CREATE INDEX IF NOT EXISTS idx_question_replies_question_id ON question_replies(question_id);
CREATE INDEX IF NOT EXISTS idx_bottles_status ON bottles(status);
CREATE INDEX IF NOT EXISTS idx_bottles_creator ON bottles(creator_id);
CREATE INDEX IF NOT EXISTS idx_bottles_picker ON bottles(picker_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);