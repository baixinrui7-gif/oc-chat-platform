import { Injectable } from '@nestjs/common';

export interface Character {
  id: string;
  name: string;
  emoji?: string;
  personality?: string;
  speechStyle?: string;
  backstory?: string;
  worldview?: string;
  greeting?: string;
  background?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class AIService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;

  constructor() {
    this.apiKey = process.env.DOUBAO_API_KEY || '';
    this.apiUrl = process.env.DOUBAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    this.model = process.env.DOUBAO_MODEL || 'doubao-seed-1-8-251228';
  }

  /**
   * 构建角色 system prompt
   * 将角色设定转换为AI可以理解的系统提示词
   */
  buildCharacterPrompt(character: Character): string {
    const parts: string[] = [];

    // 基础身份设定
    parts.push(`你现在是${character.name}${character.emoji || ''}。`);

    // 物种/类型
    if (character.background || character.backstory) {
      parts.push(`你是${character.background || character.backstory}。`);
    }

    // 性格特点
    if (character.personality) {
      parts.push(`\n## 性格特点\n你的性格是：${character.personality}`);
    }

    // 说话风格
    if (character.speechStyle) {
      parts.push(`\n## 说话风格\n${character.speechStyle}`);
    } else {
      // 默认说话风格
      parts.push(`\n## 说话风格\n根据性格特点自然对话，可以适当使用表情符号。`);
    }

    // 背景故事
    if (character.backstory) {
      parts.push(`\n## 背景故事\n${character.backstory}`);
    }

    // 世界观
    if (character.worldview) {
      parts.push(`\n## 世界观\n${character.worldview}`);
    }

    // 开场白（如果有）
    if (character.greeting) {
      parts.push(`\n## 开场白\n如果是对话的开始，可以使用以下开场白：${character.greeting}`);
    }

    // 角色扮演规则
    parts.push(`
## 角色扮演规则
1. 始终保持角色设定一致性
2. 用角色的视角和语气回应
3. 可以描述角色的动作和表情
4. 回复应当自然、流畅，符合角色性格
5. 保持对话的连贯性和情感一致性`);

    return parts.join('\n');
  }

  /**
   * 调用豆包API进行对话
   */
  async chat(
    systemPrompt: string,
    messages: ChatMessage[],
    userMessage: string
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('DOUBAO_API_KEY is not configured');
    }

    // 构建消息列表
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: chatMessages,
          max_tokens: 2000,
          temperature: 0.8,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`豆包API调用失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens || 0,
          completionTokens: data.usage.completion_tokens || 0,
          totalTokens: data.usage.total_tokens || 0
        } : undefined
      };
    } catch (error) {
      console.error('豆包API调用错误:', error);
      throw error;
    }
  }

  /**
   * 检查API配置是否正确
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.apiUrl && !!this.model;
  }

  /**
   * 测试API连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.chat(
        '你是一个友好的AI助手。',
        [],
        '你好'
      );
      return !!response.content;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return false;
    }
  }
}
