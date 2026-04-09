// 角色类型定义
export interface Character {
  id: string;
  name: string;
  emoji?: string;
  avatar?: string;
  personality?: string;
  background?: string;
  greeting?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  conversationCount?: number;
  description?: string;
  lastChat?: string;
  messages?: number;
}

export interface CreateCharacterDto {
  name: string;
  emoji?: string;
  avatar?: string;
  personality?: string;
  background?: string;
  greeting?: string;
}

// 消息类型定义
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
  role: "user";
}

// 对话类型定义
export interface Conversation {
  id: string;
  characterId: string;
  createdAt: string;
  updatedAt: string;
}
