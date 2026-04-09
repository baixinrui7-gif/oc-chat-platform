"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  characterEmoji?: string;
}

export default function MessageBubble({ message, characterEmoji = "🌙" }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-5 py-3 rounded-2xl ${
          isUser
            ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-[var(--color-bg-base)] rounded-br-md shadow-[0_4px_15px_rgba(184,169,201,0.3)]"
            : "glass rounded-bl-md border border-[var(--color-border)]"
        }`}
      >
        {!isUser && (
          <div className="text-lg mb-1">{characterEmoji}</div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed text-[var(--color-text-primary)]">
          {message.content}
        </p>
        <p className={`text-xs mt-2 ${
          isUser 
            ? "text-[var(--color-primary-dark)] opacity-75" 
            : "text-[var(--color-text-muted)]"
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          })}
        </p>
      </div>
    </motion.div>
  );
}
