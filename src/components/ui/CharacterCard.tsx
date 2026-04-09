"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Character } from "@/types";
import Card from "./Card";

interface CharacterCardProps {
  character: Character;
  showStats?: boolean;
}

export default function CharacterCard({ character, showStats = false }: CharacterCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/character/${character.id}`}>
        <Card variant="glow" hover className="p-5 h-full">
          <div className="flex flex-col items-center text-center">
            {/* 头像 */}
            <div className="text-6xl mb-4 drop-shadow-lg">
              {character.emoji || "✨"}
            </div>
            
            {/* 名称 */}
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              {character.name}
            </h3>
            
            {/* 描述 */}
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
              {character.personality?.slice(0, 50) || "暂无描述"}
              {(character.personality?.length || 0) > 50 && "..."}
            </p>
            
            {/* 统计信息 */}
            {showStats && (
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mt-auto pt-3 border-t border-[var(--color-border)] w-full justify-center">
                {character.conversationCount !== undefined && (
                  <span>💬 {character.conversationCount} 次对话</span>
                )}
                {character.createdAt && (
                  <span>📅 {new Date(character.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
