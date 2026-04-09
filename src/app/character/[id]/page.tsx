"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Edit, Trash2, Sparkles, Heart, BookOpen, Quote, Calendar, MessageSquare, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Character } from "@/types";
import { getCharacter, deleteCharacter } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchCharacter() {
      const data = await getCharacter(id);
      setCharacter(data);
      setLoading(false);
    }
    fetchCharacter();
  }, [id]);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    const success = await deleteCharacter(id);
    if (success) {
      router.push("/my");
    } else {
      alert("删除失败，请重试");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-[var(--color-bg-elevated)] rounded"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="glass rounded-2xl p-6">
                <div className="h-48 bg-[var(--color-bg-elevated)] rounded mb-4"></div>
                <div className="h-6 bg-[var(--color-bg-elevated)] rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-1/2 mx-auto"></div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6 h-32"></div>
              <div className="glass rounded-2xl p-6 h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
          角色不存在
        </h2>
        <Link href="/">
          <Button variant="primary">返回首页</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link 
          href="/my"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          返回我的角色
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 左侧 - 角色信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glow" className="p-6 sticky top-28">
            <div className="text-center">
              <motion.div 
                className="text-8xl mb-4 drop-shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {character.emoji || "✨"}
              </motion.div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {character.name}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                创建于 {character.createdAt ? new Date(character.createdAt).toLocaleDateString() : "未知"}
              </p>
              
              {/* 操作按钮 */}
              <div className="space-y-3">
                <Link href={`/chat/${character.id}`} className="block">
                  <Button variant="gradient" className="w-full">
                    <MessageCircle size={18} />
                    开始对话
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Link href={`/character/${character.id}/edit`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <Edit size={18} />
                    </Button>
                  </Link>
                  {showDeleteConfirm ? (
                    <div className="flex-1 flex gap-1">
                      <Button 
                        variant="primary" 
                        className="flex-1 bg-[var(--color-error)] hover:bg-[var(--color-error)]/80"
                        onClick={handleDelete}
                      >
                        确认
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex-1"
                        onClick={cancelDelete}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-[var(--color-error)]"
                      onClick={handleDelete}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>

              {/* 统计信息 */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-[var(--color-text-muted)]">对话次数</div>
                    <div className="text-lg font-semibold text-[var(--color-accent)]">
                      {character.conversationCount || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[var(--color-text-muted)]">消息数</div>
                    <div className="text-lg font-semibold text-[var(--color-primary)]">
                      {character.messages || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 右侧 - 详细信息 */}
        <div className="md:col-span-2 space-y-6">
          {/* 性格特点 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                <Heart className="text-[var(--color-accent)]" size={20} />
                性格特点
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {character.personality || "暂无性格描述"}
              </p>
            </Card>
          </motion.div>

          {/* 背景故事 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                <BookOpen className="text-[var(--color-accent)]" size={20} />
                背景故事
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {character.background || "暂无背景故事"}
              </p>
            </Card>
          </motion.div>

          {/* 开场白 */}
          {character.greeting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 glow-border">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                  <Quote className="text-[var(--color-accent)]" size={20} />
                  开场白
                </h2>
                <p className="text-[var(--color-accent)] italic text-lg leading-relaxed">
                  "{character.greeting}"
                </p>
              </Card>
            </motion.div>
          )}

          {/* 角色信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                <Sparkles className="text-[var(--color-accent)]" size={20} />
                角色信息
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 glass rounded-xl">
                  <Calendar className="text-[var(--color-text-muted)]" size={18} />
                  <div>
                    <div className="text-xs text-[var(--color-text-muted)]">创建时间</div>
                    <div className="text-sm text-[var(--color-text-primary)]">
                      {character.createdAt ? new Date(character.createdAt).toLocaleDateString() : "未知"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 glass rounded-xl">
                  <MessageSquare className="text-[var(--color-text-muted)]" size={18} />
                  <div>
                    <div className="text-xs text-[var(--color-text-muted)]">对话次数</div>
                    <div className="text-sm text-[var(--color-text-primary)]">
                      {character.conversationCount || 0} 次
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 删除确认提示 */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-6 rounded-2xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <AlertCircle className="text-[var(--color-error)] mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                确定要删除这个角色吗？
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                删除后将无法恢复，所有对话记录也会被删除。
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={cancelDelete}>
                  取消
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 bg-[var(--color-error)] hover:bg-[var(--color-error)]/80"
                  onClick={handleDelete}
                >
                  删除
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
