import React from 'react';

interface DesktopLayoutProps {
  children?: React.ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="desktop-layout min-h-screen bg-gray-50">
      {/* 简单的桌面端顶部导航 */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">众创医案平台</h1>
          <nav className="flex space-x-6">
            <a href="/desktop/cases" className="text-gray-700 hover:text-blue-600">医案</a>
            <a href="/desktop/community" className="text-gray-700 hover:text-blue-600">社区</a>
            <a href="/desktop/messages" className="text-gray-700 hover:text-blue-600">消息</a>
            <a href="/desktop/profile" className="text-gray-700 hover:text-blue-600">个人中心</a>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}