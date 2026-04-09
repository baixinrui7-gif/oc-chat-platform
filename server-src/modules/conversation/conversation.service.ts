import { Injectable } from '@nestjs/common';

// Mock 数据
const mockConversations = [
  {
    id: 'conv_1',
    characterId: '1',
    userId: 'user_1',
    title: '关于月亮的对话',
    lastMessage: '我理解你的感受...在这星空之下，一切都会变得清晰。',
    lastMessageAt: new Date('2024-01-20T22:30:00'),
    messageCount: 42,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
];

@Injectable()
export class ConversationService {
  private conversations = [...mockConversations];

  findAll(characterId?: string) {
    if (characterId) {
      return this.conversations.filter(c => c.characterId === characterId);
    }
    return this.conversations;
  }

  findOne(id: string) {
    return this.conversations.find(c => c.id === id) || null;
  }

  create(data: any) {
    const conversation = {
      id: `conv_${Date.now()}`,
      ...data,
      title: '新对话',
      lastMessage: '',
      lastMessageAt: new Date(),
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(conversation);
    return conversation;
  }

  remove(id: string) {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.conversations.splice(index, 1);
    return true;
  }
}
