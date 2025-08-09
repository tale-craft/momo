import { generateId } from '../utils/helpers';

export class StorageService {
  constructor(private r2: R2Bucket) {}
  
  async uploadImage(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const key = `images/${generateId()}-${file.name}`;
    
    await this.r2.put(key, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    });
    
    // 返回 CDN URL
    return `https://cdn.momo.lyle.im/${key}`;
  }
  
  async deleteImage(key: string): Promise<void> {
    await this.r2.delete(key);
  }
}
