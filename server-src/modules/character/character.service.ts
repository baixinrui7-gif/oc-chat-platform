import { Injectable } from '@nestjs/common';

// Mock 数据
const mockCharacters = [
  {
    id: '1',
    name: '月光',
    emoji: '🌙',
    avatar: '',
    personality: '神秘、冷淡但内心温柔，喜欢在夜晚活动，对星空有着特殊的情感。',
    background: '月之精灵一族的后裔，拥有操控月光的能力。曾经见证了无数个世纪的变迁。',
    greeting: '哦？你来了...在这个宁静的夜晚，让我们开始对话吧。',
    userId: 'user_1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '星尘',
    emoji: '⭐',
    avatar: '',
    personality: '活泼开朗，好奇心强，喜欢探索未知的世界。',
    background: '来自遥远星际的旅行家，跨越无数星系只为寻找宇宙的奥秘。',
    greeting: '你好啊！我是星尘，很高兴认识你！',
    userId: 'user_1',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
];

@Injectable()
export class CharacterService {
  // Mock 数据存储
  private characters = [...mockCharacters];

  findAll(userId?: string) {
    if (userId) {
      return this.characters.filter(c => c.userId === userId);
    }
    return this.characters;
  }

  findOne(id: string) {
    return this.characters.find(c => c.id === id) || null;
  }

  create(data: any) {
    const character = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.characters.push(character);
    return character;
  }

  update(id: string, data: any) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.characters[index] = {
      ...this.characters[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.characters[index];
  }

  remove(id: string) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.characters.splice(index, 1);
    return true;
  }
}
