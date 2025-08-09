import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { StorageService } from '../services/storage';
import type { Env } from '../types';

const app = new Hono<{ Bindings: Env }>();

app.post('/', requireAuth, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: 'Invalid file type' }, 400);
  }
  
  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: 'File too large' }, 400);
  }
  
  const storage = new StorageService(c.env.R2);
  
  try {
    const url = await storage.uploadImage(file);
    return c.json({ url });
  } catch (error) {
    return c.json({ error: 'Upload failed' }, 500);
  }
});

export default app;
