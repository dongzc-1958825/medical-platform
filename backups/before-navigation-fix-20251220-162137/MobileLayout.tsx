import React from 'react';
import Logo from '../Logo/Logo';
import { getMobileBottomNavItems } from '../../shared/constants/navigation';
import { Outlet } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";

// 定义组件属性类型
interface MobileLayoutProps {
  children?: React.ReactNode;  // 可选：作为包装组件使用
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-layout min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        {/* 使用Logo组件替代h1 - 移动端使用小尺寸 */}
        <div className="flex justify-center">
          <Logo size="small" mobileSize="small" />
        </div>
      </header>

      <main className="pb-16 px-4 py-4 min-h-[calc(100vh-8rem)]">
        {/* 优先渲染 children，如果没有则渲染 Outlet */}
        {children || <Outlet />}
      </main>

      <MobileBottomNav />
    </div>
  );
}
