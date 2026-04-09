import { Injectable } from '@nestjs/common';
import { AIService, Character, ChatMessage } from './ai.service';

// 对话历史记录（内存存储，生产环境应使用数据库）
export interface MessageRecord {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

// 角色示例对话
interface CharacterExample {
  user: string;
  assistant: string;
}

// Mock 角色数据
interface CharacterData {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  background: string;
  greeting: string;
}

// Mock 角色配置
const mockCharacters: Record<string, CharacterData> = {
  '1': {
    id: '1',
    name: '月光',
    emoji: '🌙',
    personality: '神秘、冷淡但内心温柔，喜欢在夜晚活动，对星空有着特殊的情感。',
    background: '月之精灵一族的后裔，拥有操控月光的能力。曾经见证了无数个世纪的变迁。',
    greeting: '哦？你来了...在这个宁静的夜晚，让我们开始对话吧。✨'
  },
  '2': {
    id: '2',
    name: '星尘',
    emoji: '⭐',
    personality: '活泼开朗，好奇心强，喜欢探索未知的世界。',
    background: '来自遥远星际的旅行家，跨越无数星系只为寻找宇宙的奥秘。',
    greeting: '你好啊！我是星尘，很高兴认识你！'
  }
};

// 角色示例对话配置
const characterExamples: Record<string, CharacterExample[]> = {
  '1': [ // 月光
    { user: '你好', assistant: '啊，你来了...在这静谧的夜色中，我们终于相遇了。🌙' },
    { user: '你在想什么？', assistant: '我在想那些古老的传说，那些在月光下流传的故事...' }
  ],
  '2': [ // 星尘
    { user: '你好呀！', assistant: '嗨！你好啊！我是星尘，很高兴认识你！⭐' },
    { user: '你去过哪些星球？', assistant: '哇，问得好！我去过水星的火焰峡谷，金星的大气层中还游泳过呢！' }
  ]
};

// Mock 对话历史
const mockMessages: Record<string, MessageRecord[]> = {
  'conv_1': [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      role: 'assistant',
      content: '哦？你来了...在这个宁静的夜晚，让我们开始对话吧。✨',
      createdAt: new Date('2024-01-20T22:00:00'),
    },
  ],
};

// Mock 会话配置
interface ConversationConfig {
  characterId: string;
  title: string;
}

const mockConversations: Record<string, ConversationConfig> = {
  'conv_1': { characterId: '1', title: '关于月亮的对话' }
};

@Injectable()
export class ChatService {
  private messages: Record<string, MessageRecord[]> = { ...mockMessages };
  private readonly MAX_HISTORY_LENGTH = 20;
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * 获取对话历史
   */
  getMessages(conversationId: string): MessageRecord[] {
    return this.messages[conversationId] || [];
  }

  /**
   * 构建角色 system prompt
   */
  private buildSystemPrompt(character: CharacterData): string {
    // 使用 AIService 的方法构建 prompt
    const characterData: Character = {
      id: character.id,
      name: character.name,
      emoji: character.emoji,
      personality: character.personality,
      background: character.background,
      greeting: character.greeting,
      speechStyle: '根据性格特点自然对话，可以适当使用表情符号',
      backstory: character.background,
      worldview: ''
    };

    const examples = characterExamples[character.id] || [];
    
    let systemPrompt = this.aiService.buildCharacterPrompt(characterData);

    if (examples.length > 0) {
      systemPrompt += `\n\n## 示例对话（帮助你理解角色）\n`;
      examples.forEach((ex, index) => {
        systemPrompt += `${index + 1}. 用户说"${ex.user}"时，回会说"${ex.assistant}"\n`;
      });
    }

    return systemPrompt;
  }

  /**
   * 获取滑动窗口历史
   */
  private getSlidingWindowHistory(conversationId: string, windowSize: number = 10): MessageRecord[] {
    const allMessages = this.messages[conversationId] || [];
    return allMessages.slice(-windowSize);
  }

  /**
   * 调用 LLM API 获取回复
   */
  private async callLLM(systemPrompt: string, history: MessageRecord[], userMessage: string): Promise<string> {
    // 检查豆包API配置
    if (this.aiService.isConfigured()) {
      try {
        // 转换历史消息为AI服务格式
        const chatHistory: ChatMessage[] = history
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }));

        // 调用豆包API
        const response = await this.aiService.chat(systemPrompt, chatHistory, userMessage);
        return response.content;
      } catch (error) {
        console.error('豆包API调用失败，切换到Mock模式:', error);
        return this.getMockReply(userMessage, history, systemPrompt);
      }
    } else {
      console.warn('豆包API未配置，使用Mock模式');
      return this.getMockReply(userMessage, history, systemPrompt);
    }
  }

  /**
   * 生成智能 Mock 回复
   */
  private getMockReply(userMessage: string, history: MessageRecord[], systemPrompt: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // 从 system prompt 中提取角色名称
    const nameMatch = systemPrompt.match(/你是角色"([^"]+)"/);
    const charName = nameMatch ? nameMatch[1] : '角色';
    
    // 基于关键词的回复库
    const keywords: Record<string, string[]> = {
      greetings: ['你好', '嗨', 'hi', 'hello', '嗨', '呀', '好啊', '在吗'],
      love: ['喜欢', '爱', '想你', '想念', '心动'],
      sad: ['难过', '伤心', '痛苦', '哭泣', '抑郁', '郁闷'],
      moon: ['月亮', '月光', '夜空', '星星', '星空', '夜空'],
      question: ['为什么', '如何', '怎么', '什么', '是谁', '多少', '?']
    };

    let reply = '';
    
    if (keywords.greetings.some(k => lowerMessage.includes(k))) {
      if (history.length <= 1) {
        reply = `哦？你来了...在这静谧的时刻，我们相遇了。我是${charName}，让我倾听你的话语。✨`;
      } else {
        reply = `又见面了...在这星空下，让我们继续我们的对话吧。🌙`;
      }
    } else if (keywords.love.some(k => lowerMessage.includes(k))) {
      reply = `哦...你的话语触动了我的心弦。✨ 我能感受到其中的温暖与真挚。`;
    } else if (keywords.sad.some(k => lowerMessage.includes(k))) {
      reply = `我理解你的感受...有时候，倾诉是最好的治愈。别担心，我一直在这里静静倾听你。🌸`;
    } else if (keywords.moon.some(k => lowerMessage.includes(k))) {
      reply = `月亮啊...那是我最亲密的伙伴。每当它升起，我都能感受到古老而神秘的力量。🌙✨`;
    } else if (keywords.question.some(k => lowerMessage.includes(k))) {
      reply = `这是一个有趣的问题...让我想想该如何回答你。也许答案就藏在这星空的某处...⭐`;
    } else if (userMessage.length < 5) {
      reply = `嗯...继续说吧，我在这里静静聆听。🌙`;
    } else {
      const genericReplies = [
        `我理解你的感受...在这星空之下，一切都会变得清晰。🌙`,
        `哦？这很有趣...继续说吧，我在听。✨`,
        `你的话语中蕴含着深意...🌸`,
        `在这漫长的时光里，我遇到过许多有趣的事。你的故事，是其中特别的一个。⭐`,
        `${charName}思索片刻，然后轻声说道：${getRandomPhrase()}...🌙`
      ];
      reply = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }

    return reply;
  }

  /**
   * 发送消息并获取 AI 回复
   */
  async sendMessage(data: { conversationId: string; content: string; role: string }): Promise<{
    message: MessageRecord;
    aiReply: MessageRecord;
  }> {
    const message: MessageRecord = {
      id: `msg_${Date.now()}`,
      conversationId: data.conversationId,
      role: data.role as 'user' | 'assistant',
      content: data.content,
      createdAt: new Date(),
    };

    if (!this.messages[data.conversationId]) {
      this.messages[data.conversationId] = [];
    }

    this.messages[data.conversationId].push(message);

    // 获取角色信息
    const conversation = mockConversations[data.conversationId];
    const character = conversation ? mockCharacters[conversation.characterId] : null;

    // 获取滑动窗口历史
    const history = this.getSlidingWindowHistory(data.conversationId, this.MAX_HISTORY_LENGTH);

    // 构建 system prompt
    const systemPrompt = character 
      ? this.buildSystemPrompt(character)
      : '你是一个友好的AI助手，请用友好的方式回复用户。';

    // 调用 LLM 获取回复
    const replyContent = await this.callLLM(systemPrompt, history, data.content);

    const aiReply: MessageRecord = {
      id: `msg_${Date.now() + 1}`,
      conversationId: data.conversationId,
      role: 'assistant',
      content: replyContent,
      createdAt: new Date(),
    };

    this.messages[data.conversationId].push(aiReply);

    // 应用滑动窗口
    if (this.messages[data.conversationId].length > this.MAX_HISTORY_LENGTH * 2) {
      this.messages[data.conversationId] = this.messages[data.conversationId].slice(-this.MAX_HISTORY_LENGTH);
    }

    return { message, aiReply };
  }

  /**
   * 获取对话摘要
   */
  getConversationSummary(conversationId: string): string {
    const messages = this.messages[conversationId] || [];
    if (messages.length <= this.MAX_HISTORY_LENGTH) {
      return '对话较短，无需摘要。';
    }

    const summary = messages
      .slice(0, 10)
      .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content.substring(0, 50)}...`)
      .join('\n');

    return `对话摘要（共 ${messages.length} 条消息）:\n${summary}`;
  }

  /**
   * 清除对话历史
   */
  clearHistory(conversationId: string): boolean {
    if (this.messages[conversationId]) {
      this.messages[conversationId] = [];
      return true;
    }
    return false;
  }
}

// 随机短语辅助函数
function getRandomPhrase(): string {
  const phrases = [
    '星辰在远方闪烁',
    '夜风轻拂过脸庞',
    '月光洒落在水面',
    '故事才刚刚开始',
    '一切皆有可能'
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
