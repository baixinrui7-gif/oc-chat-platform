import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OC Chat - AI角色对话平台",
  description: "创建你的OC，与AI角色对话互动",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {/* 梦核风格背景 */}
        <div className="dream-bg">
          <div className="gradient-flow"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
          {/* 星星效果 */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* 顶部导航 */}
        <header className="glass fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)]">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl transition-transform group-hover:scale-110">✨</span>
              <span className="text-xl font-semibold text-[var(--color-text-primary)]">
                OC Chat
              </span>
            </Link>
            
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                首页
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/create" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                创建角色
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/my" 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                我的角色
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
              </Link>
            </div>
          </nav>
        </header>

        {/* 主内容区 */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* 底部装饰 */}
        <footer className="py-8 text-center text-[var(--color-text-muted)] text-sm">
          <p className="breathe">✨ OC Chat - 让每个角色都有灵魂 ✨</p>
        </footer>
      </body>
    </html>
  );
}
