import { Character, CreateCharacterDto, Message, SendMessageDto } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 获取公开角色列表
export async function getPublicCharacters(): Promise<Character[]> {
  try {
    const res = await fetch(`${API_BASE}/api/characters`);
    if (!res.ok) throw new Error("获取角色列表失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// 获取用户角色列表
export async function getMyCharacters(userId?: string): Promise<Character[]> {
  try {
    const url = userId 
      ? `${API_BASE}/api/characters?userId=${userId}` 
      : `${API_BASE}/api/characters`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("获取角色列表失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// 获取单个角色详情
export async function getCharacter(id: string): Promise<Character | null> {
  try {
    const res = await fetch(`${API_BASE}/api/characters/${id}`);
    if (!res.ok) throw new Error("获取角色详情失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

// 创建角色
export async function createCharacter(data: CreateCharacterDto): Promise<Character | null> {
  try {
    const res = await fetch(`${API_BASE}/api/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("创建角色失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

// 更新角色
export async function updateCharacter(id: string, data: Partial<CreateCharacterDto>): Promise<Character | null> {
  try {
    const res = await fetch(`${API_BASE}/api/characters/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("更新角色失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

// 删除角色
export async function deleteCharacter(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/characters/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("API Error:", error);
    return false;
  }
}

// 获取对话消息
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const res = await fetch(`${API_BASE}/api/chat/messages?conversationId=${conversationId}`);
    if (!res.ok) throw new Error("获取消息失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// 发送消息
export async function sendMessage(data: SendMessageDto): Promise<Message | null> {
  try {
    const res = await fetch(`${API_BASE}/api/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("发送消息失败");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
