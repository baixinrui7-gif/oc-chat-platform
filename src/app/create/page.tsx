"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Heart, BookOpen, Globe, ChevronRight, ChevronLeft, Save, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { createCharacter } from "@/lib/api";

interface FormData {
  name: string;
  emoji: string;
  personality: string;
  background: string;
  greeting: string;
  worldView: string;
}

interface FormErrors {
  name?: string;
  personality?: string;
  background?: string;
  greeting?: string;
}

const STEPS = [
  { id: 1, title: "基础信息", icon: User, description: "角色的基本信息" },
  { id: 2, title: "性格设定", icon: Heart, description: "定义角色性格" },
  { id: 3, title: "身世背景", icon: BookOpen, description: "角色的过去经历" },
  { id: 4, title: "世界观", icon: Globe, description: "角色所在的世界" },
];

const EMOJI_OPTIONS = ["🌙", "⭐", "🌸", "🌅", "💫", "🦋", "🌊", "🔥", "❄️", "🌈", "🌺", "🍃", "🎭", "🎨", "✨", "🔮"];

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    emoji: "🌙",
    personality: "",
    background: "",
    greeting: "",
    worldView: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "请输入角色名称";
      } else if (formData.name.length > 50) {
        newErrors.name = "角色名称不能超过50个字符";
      }
    }
    
    if (step === 2) {
      if (!formData.personality.trim()) {
        newErrors.personality = "请描述角色的性格特点";
      }
    }

    if (step === 3) {
      if (!formData.background.trim()) {
        newErrors.background = "请描述角色的背景故事";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    
    setIsSubmitting(true);
    try {
      const result = await createCharacter({
        name: formData.name,
        emoji: formData.emoji,
        personality: formData.personality,
        background: formData.background,
        greeting: formData.greeting || undefined,
      });
      
      if (result) {
        router.push(`/character/${result.id}`);
      } else {
        alert("创建失败，请重试");
      }
    } catch (error) {
      console.error("创建角色失败:", error);
      alert("创建失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 标题区域 */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-[var(--color-accent)]" />
          创建新角色
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          设定角色的外貌、性格和故事，让角色拥有独特的灵魂
        </p>
      </motion.div>

      {/* 步骤指示器 */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center relative">
          {/* 进度线 */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-[var(--color-border)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center relative z-10"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-[var(--color-bg-base)] shadow-[0_0_20px_var(--glow-accent)]" 
                      : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium transition-colors ${
                  isCurrent ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 表单内容区 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glow" className="p-8 mb-8">
            {/* 步骤1：基础信息 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-6">
                  <User className="text-[var(--color-accent)]" size={24} />
                  基础信息
                </h2>
                
                <Input
                  label="角色名称 *"
                  placeholder="给你的角色起个名字"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  error={errors.name}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                    选择头像
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => updateFormData("emoji", emoji)}
                        className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${
                          formData.emoji === emoji
                            ? "bg-[var(--color-primary)] scale-110 shadow-[0_0_15px_var(--glow-primary)]"
                            : "glass hover:bg-[var(--color-bg-elevated)]"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 步骤2：性格设定 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-6">
                  <Heart className="text-[var(--color-accent)]" size={24} />
                  性格设定
                </h2>
                
                <Textarea
                  label="性格特点 *"
                  placeholder="描述角色的性格特点，例如：温柔但内心有些忧郁，喜欢独处..."
                  value={formData.personality}
                  onChange={(e) => updateFormData("personality", e.target.value)}
                  error={errors.personality}
                  rows={6}
                />

                <Textarea
                  label="开场白"
                  placeholder="角色第一次对话时的开场白，例如：你好啊，很高兴认识你..."
                  value={formData.greeting}
                  onChange={(e) => updateFormData("greeting", e.target.value)}
                  error={errors.greeting}
                  rows={4}
                />
              </div>
            )}

            {/* 步骤3：身世背景 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-6">
                  <BookOpen className="text-[var(--color-accent)]" size={24} />
                  身世背景
                </h2>
                
                <Textarea
                  label="背景故事 *"
                  placeholder="描述角色的过去、经历、身份，例如：出生于xxx，拥有特殊能力，曾经历过..."
                  value={formData.background}
                  onChange={(e) => updateFormData("background", e.target.value)}
                  error={errors.background}
                  rows={10}
                />
              </div>
            )}

            {/* 步骤4：世界观 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2 mb-6">
                  <Globe className="text-[var(--color-accent)]" size={24} />
                  世界观
                </h2>
                
                <Textarea
                  label="世界观设定（可选）"
                  placeholder="描述角色所在的世界、环境设定，例如：在一个人类与精灵共存的世界..."
                  value={formData.worldView}
                  onChange={(e) => updateFormData("worldView", e.target.value)}
                  rows={6}
                />
                
                {/* 预览卡片 */}
                <div className="mt-8 p-6 glass rounded-xl border border-[var(--color-border)]">
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">角色预览</h3>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{formData.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                        {formData.name || "未命名角色"}
                      </h4>
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {formData.personality || "性格描述待填写..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* 底部导航按钮 */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="secondary" 
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          <ChevronLeft size={18} />
          上一步
        </Button>

        <div className="text-[var(--color-text-muted)] text-sm">
          步骤 {currentStep} / {STEPS.length}
        </div>

        {currentStep < STEPS.length ? (
          <Button variant="primary" onClick={handleNext}>
            下一步
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button 
            variant="gradient" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-dots">创建中</span>
              </>
            ) : (
              <>
                <Save size={18} />
                创建角色
              </>
            )}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
