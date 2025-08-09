import type { Env, User } from '../types';
import { generateId } from '../utils/helpers';

export class DatabaseService {
  constructor(private db: D1Database) {}
  
  // 用户相关
  async createUser(clerkId: string, email: string, name = 'momo'): Promise<User> {
    const id = generateId();
    const avatarType = this.getRandomAvatarType();
    
    await this.db.prepare(
      `INSERT INTO users (id, clerk_id, email, name, avatar_type) 
       VALUES (?, ?, ?, ?, ?)`
    ).bind(id, clerkId, email, name, avatarType).run();
    
    return this.getUserById(id)!;
  }
  
  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(id).first<User>();
    
    return result;
  }
  
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE clerk_id = ?'
    ).bind(clerkId).first<User>();
    
    return result;
  }
  
  async getUserByHandle(handle: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE handle = ?'
    ).bind(handle).first<User>();
    
    return result;
  }
  
  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const updates = [];
    const values = [];
    
    if (data.handle !== undefined) {
      updates.push('handle = ?');
      values.push(data.handle);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(data.avatar_url);
    }
    if (data.avatar_type !== undefined) {
      updates.push('avatar_type = ?');
      values.push(data.avatar_type);
    }
    
    if (updates.length === 0) return null;
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await this.db.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();
    
    return this.getUserById(id);
  }
  
  private getRandomAvatarType(): string {
    const types = ['default_1', 'default_2', 'default_3'];
    return types[Math.floor(Math.random() * types.length)];
  }
}
