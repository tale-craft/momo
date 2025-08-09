import type { Env } from '../types';
import { generateId } from '../utils/helpers';

export class EmailService {
  constructor(private env: Env) {}
  
  async queueEmail(params: {
    recipient: string;
    type: 'question_received' | 'question_answered' | 'bottle_replied' | 'verification';
    payload: any;
  }) {
    const id = generateId();
    
    await this.env.DB.prepare(
      `INSERT INTO email_queue (id, recipient_email, type, payload) 
       VALUES (?, ?, ?, ?)`
    ).bind(id, params.recipient, params.type, JSON.stringify(params.payload)).run();
  }
  
  async sendEmail(to: string, subject: string, html: string) {
    // 使用 Cloudflare Email Workers API
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/email/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: this.env.EMAIL_FROM,
        to,
        subject,
        html
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  }
  
  generateEmailHtml(type: string, payload: any): { subject: string; html: string } {
    switch (type) {
      case 'question_received':
        return {
          subject: '有人向你提问了！',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>你收到了一个新问题</h2>
              <p>来自：${payload.askerName}</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p>${payload.content}</p>
              </div>
              <a href="${this.env.FRONTEND_URL}/questions/${payload.questionId}" 
                 style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                查看并回答
              </a>
            </div>
          `
        };
      
      case 'question_answered':
        return {
          subject: '你的问题被回答了！',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>${payload.answererName} 回答了你的问题</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>你的问题：</strong> ${payload.question}</p>
                <p><strong>回答：</strong> ${payload.answer}</p>
              </div>
              <a href="${this.env.FRONTEND_URL}/@${payload.answererHandle}" 
                 style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                查看完整对话
              </a>
            </div>
          `
        };
      
      case 'bottle_replied':
        return {
          subject: '你的漂流瓶收到了回复！',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>${payload.senderName} 回复了你的漂流瓶</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p>${payload.content}</p>
              </div>
              <a href="${this.env.FRONTEND_URL}/bottles/${payload.bottleId}" 
                 style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                查看对话
              </a>
            </div>
          `
        };
      
      default:
        return {
          subject: 'Momo 通知',
          html: '<p>你有新的消息</p>'
        };
    }
  }
}

export async function processEmailQueue(env: Env) {
  const emailService = new EmailService(env);
  
  // 获取待发送的邮件
  const pending = await env.DB.prepare(
    `SELECT * FROM email_queue WHERE status = 'pending' LIMIT 10`
  ).all();
  
  for (const email of pending.results) {
    try {
      const payload = JSON.parse(email.payload);
      const { subject, html } = emailService.generateEmailHtml(email.type, payload);
      
      await emailService.sendEmail(email.recipient_email, subject, html);
      
      // 更新状态
      await env.DB.prepare(
        `UPDATE email_queue SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(email.id).run();
    } catch (error) {
      console.error(`Failed to send email ${email.id}:`, error);
      
      // 标记为失败
      await env.DB.prepare(
        `UPDATE email_queue SET status = 'failed' WHERE id = ?`
      ).bind(email.id).run();
    }
  }
}
