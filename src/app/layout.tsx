import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "聊天任务整理助手",
  description: "从聊天文本中自动生成待办事项",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
