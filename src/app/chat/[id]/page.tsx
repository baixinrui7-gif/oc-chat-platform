"use client";

import { use } from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, MoreVertical, Phone, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MessageBubble from "@/components/ui/MessageBubble";
import { Message, Character } from "@/types";
import { getCharacter, sendMessage } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: PageProps) {
  const { id } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 获取角色信息
  useEffect(() => {
    async function fetchCharacter() {
      const data = await getCharacter(id);
      if (data) {
        setCharacter(data);
        // 如果有开场白，添加为第一条消息
        if (data.greeting) {
          setMessages([{
            id: "0",
            role: "assistant",
            content: data.greeting,
            timestamp: new Date(),
          }]);
        }
      }
      setLoading(false);
    }
    fetchCharacter();
  }, [id]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // 调用API发送消息
      const response = await sendMessage({
        conversationId: id,
        content: userMessage.content,
        role: "user",
      });

      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.content || generateMockResponse(userMessage.content),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Mock 回复
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: generateMockResponse(userMessage.content),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1500);
      }
    } catch (error) {
      // Mock 回复
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(userMessage.content),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  // 简单的模拟回复生成
  const generateMockResponse = (userInput: string): string => {
    const responses = [
      `${character?.name || "角色"}听到了你的话，沉思了一会儿...`,
      "这是一个有趣的想法，让我仔细想想...",
      "你说的让我想起了很多事情呢。",
      `${character?.emoji || "✨"} ${character?.name || ""}微笑着回应你。`,
      "我理解你的感受，让我们继续聊聊吧。",
      "或许这就是命运的安排，让我们在此时此地相遇。",
    ];
    
    if (userInput.includes("你好") || userInput.includes("hi") || userInput.includes("hello")) {
      return `${character?.greeting || "很高兴见到你！"}`;
    }
    
    if (userInput.includes("？") || userInput.includes("?")) {
      return "这个问题很有意思...我觉得应该这样看待它。";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">{character?.emoji || "✨"}</div>
            <p className="text-[var(--color-text-muted)] loading-dots">加载中</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-4xl mx-auto px-6">
      {/* 顶部导航 */}
      <motion.div 
        className="flex items-center justify-between py-4 border-b border-[var(--color-border)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          href={`/character/${id}`}
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">返回角色</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{character?.emoji || "✨"}</span>
              <div>
                <h1 className="font-semibold text-[var(--color-text-primary)]">
                  {character?.name || "角色"}
                </h1>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                  <span className="text-xs text-[var(--color-text-muted)]">在线</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Settings size={18} />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={18} />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 glass rounded-xl p-2 z-50">
                <button className="w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors">
                  清空对话
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0 : 0 }}
            >
              <MessageBubble 
                message={msg} 
                characterEmoji={character?.emoji} 
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 正在输入指示器 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass rounded-2xl rounded-bl-md px-5 py-3 border border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="text-lg">{character?.emoji || "✨"}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 mb-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`对 ${character?.name || "角色"} 说些什么...`}
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl glass text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none max-h-32 transition-all"
              style={{
                height: 'auto',
                minHeight: '48px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <Button 
              variant="gradient" 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 p-0 flex-shrink-0"
            >
              <Send size={20} />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
              <Sparkles size={12} />
              Enter 发送 · Shift + Enter 换行
            </p>
            <span className="text-xs text-[var(--color-text-muted)]">
              {messages.length} 条消息
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
