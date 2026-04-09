"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, MoreVertical, Trash2, Edit, Sparkles, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CharacterCard from "@/components/ui/CharacterCard";
import { Character } from "@/types";
import { getMyCharacters, deleteCharacter } from "@/lib/api";

export default function MyCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const data = await getMyCharacters();
    setCharacters(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (deletingId === id) {
      const success = await deleteCharacter(id);
      if (success) {
        setCharacters((prev) => prev.filter((char) => char.id !== id));
      }
      setDeletingId(null);
      setActiveMenu(null);
    } else {
      setDeletingId(id);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setActiveMenu(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 页面标题 */}
      <motion.div 
        className="flex items-center justify-between mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-3">
            <Star className="text-[var(--color-accent)]" />
            我的角色
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            管理你创建的所有角色
          </p>
        </div>
        <Link href="/create">
          <Button variant="gradient">
            <Plus size={20} />
            创建角色
          </Button>
        </Link>
      </motion.div>

      {/* 角色列表 */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-32 bg-[var(--color-bg-elevated)] rounded mb-4"></div>
              <div className="h-5 bg-[var(--color-bg-elevated)] rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : characters.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-16 text-center">
            <div className="text-7xl mb-6">✨</div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
              还没有创建角色
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
              开始创造你的第一个角色吧！设定独特的外貌、性格和故事，开启与AI的对话之旅。
            </p>
            <Link href="/create">
              <Button variant="gradient" size="lg">
                <Sparkles size={20} />
                创建第一个角色
              </Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {characters.map((char, idx) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                <Link href={`/character/${char.id}`}>
                  <Card variant="glow" hover className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl drop-shadow-lg">{char.emoji || "✨"}</div>
                      <button 
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-base)] opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveMenu(activeMenu === char.id ? null : char.id);
                        }}
                      >
                        <MoreVertical size={18} className="text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                      {char.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4 min-h-[40px]">
                      {char.personality?.slice(0, 60) || "暂无描述"}
                      {(char.personality?.length || 0) > 60 && "..."}
                    </p>
                    
                    {/* 底部信息 */}
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border)]">
                      <span>{char.conversationCount || 0} 次对话</span>
                      <span>{char.createdAt ? new Date(char.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                  </Card>
                </Link>

                {/* 操作菜单 */}
                <AnimatePresence>
                  {activeMenu === char.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-12 right-4 w-36 glass rounded-xl p-2 z-50 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link 
                        href={`/character/${char.id}/edit`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
                        onClick={() => setActiveMenu(null)}
                      >
                        <Edit size={14} />
                        编辑角色
                      </Link>
                      <Link 
                        href={`/chat/${char.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
                        onClick={() => setActiveMenu(null)}
                      >
                        <MessageCircle size={14} />
                        开始对话
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(char.id);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          deletingId === char.id
                            ? "bg-[var(--color-error)] text-white"
                            : "text-[var(--color-error)] hover:bg-[var(--color-bg-elevated)]"
                        }`}
                      >
                        <Trash2 size={14} />
                        {deletingId === char.id ? "确认删除" : "删除角色"}
                      </button>
                      {deletingId === char.id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            cancelDelete();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors mt-1"
                        >
                          取消
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 底部提示 */}
      {!loading && characters.length > 0 && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            已创建 {characters.length} 个角色
          </p>
          <Link href="/create">
            <Button variant="secondary">
              <Plus size={16} />
              创建更多角色
            </Button>
          </Link>
        </motion.div>
      )}

      {/* 点击空白关闭菜单 */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setActiveMenu(null);
            setDeletingId(null);
          }}
        />
      )}
    </div>
  );
}
