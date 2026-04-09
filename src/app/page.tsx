"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Palette, MessageSquare, Star, Sparkle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CharacterCard from "@/components/ui/CharacterCard";
import { getPublicCharacters } from "@/lib/api";
import { useEffect, useState } from "react";
import { Character } from "@/types";

export default function HomePage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacters() {
      const data = await getPublicCharacters();
      setCharacters(data);
      setLoading(false);
    }
    fetchCharacters();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero 区域 */}
      <section className="text-center py-20 relative">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          欢迎来到 OC Chat
        </motion.h1>
        <motion.p 
          className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          创建属于你的原创角色，与AI对话互动
          <br />
          在这里，每个角色都有独特的灵魂
        </motion.p>
        <motion.div 
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/create">
            <Button variant="gradient" size="lg">
              <Sparkles size={20} />
              开始创建
            </Button>
          </Link>
          <Link href="/my">
            <Button variant="secondary" size="lg">
              <Star size={20} />
              查看我的角色
            </Button>
          </Link>
        </motion.div>
        
        {/* 装饰光点 */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[var(--color-accent)] rounded-full pulse-glow opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[var(--color-primary)] rounded-full pulse-glow opacity-70"></div>
      </section>

      {/* 特色功能 */}
      <section className="py-16 grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card variant="glow" className="p-6 h-full hover-lift">
            <div className="text-4xl mb-4">
              <Palette className="text-[var(--color-accent)]" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              自定义角色
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              定义角色的外貌、性格、背景故事，打造独一无二的角色形象
            </p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glow" className="p-6 h-full hover-lift">
            <div className="text-4xl mb-4">
              <MessageSquare className="text-[var(--color-accent)]" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              智能对话
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              与角色进行自然流畅的对话互动，体验沉浸式交流
            </p>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="glow" className="p-6 h-full hover-lift">
            <div className="text-4xl mb-4">
              <Star className="text-[var(--color-accent)]" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              收藏分享
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              管理和收藏你喜欢的角色，随时开启对话
            </p>
          </Card>
        </motion.div>
      </section>

      {/* 公开角色展示区域 */}
      <section className="py-16">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Sparkle className="text-[var(--color-accent)]" />
              发现精彩角色
            </h2>
            <p className="text-[var(--color-text-muted)] mt-1">
              浏览社区创建的精彩角色
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary">
              <Sparkles size={16} />
              创建角色
            </Button>
          </Link>
        </motion.div>
        
        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-24 bg-[var(--color-bg-elevated)] rounded mb-4"></div>
                <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-[var(--color-bg-elevated)] rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : characters.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {characters.map((char, idx) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
              >
                <CharacterCard character={char} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              暂无角色
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              成为第一个创建角色的人吧！
            </p>
            <Link href="/create">
              <Button variant="gradient">
                <Sparkles size={18} />
                创建角色
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* 装饰性底部元素 */}
      <section className="py-12 text-center">
        <div className="flex items-center justify-center gap-4 text-[var(--color-text-muted)]">
          <span className="w-20 h-px bg-gradient-to-r from-transparent to-[var(--color-border)]"></span>
          <span className="text-sm">✨</span>
          <span className="w-20 h-px bg-gradient-to-l from-transparent to-[var(--color-border)]"></span>
        </div>
      </section>
    </div>
  );
}
