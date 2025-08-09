import { z } from 'zod';

export const questionSchema = z.object({
  receiverHandle: z.string().min(1).max(50),
  content: z.string().min(1).max(500),
  isPrivate: z.boolean().optional(),
  images: z.array(z.string().url()).max(3).optional()
});

export const answerSchema = z.object({
  answer: z.string().min(1).max(500),
  images: z.array(z.string().url()).max(3).optional()
});

export const bottleMessageSchema = z.object({
  content: z.string().min(1).max(500),
  images: z.array(z.string().url()).max(3).optional()
});

export const profileUpdateSchema = z.object({
  handle: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  name: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  avatarType: z.enum(['default_1', 'default_2', 'default_3', 'custom', 'google']).optional()
});
