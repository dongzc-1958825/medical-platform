// src/components/layout/MobileLayout.tsx
import React from 'react';
import Logo from '../Logo/Logo';
import { Outlet, useNavigate } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";
import { useAuth } from '../../shared/hooks/useAuth'; // 引入认证钩子

// 定义组件属性类型
interface MobileLayoutProps {
  children?: React.ReactNode;
  hideHeader?: boolean;
}

export default function MobileLayout({ children, hideHeader = false }: MobileLayoutProps) {
  const { user, logout } = useAuth(); // 获取用户状态和退出函数
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/mobile'); // 退出后返回移动端首页
  };

  const handleLogin = () => {
    navigate('/login'); // 跳转到登录页
  };

  return (
    <div className="mobile-layout min-h-screen bg-gray-50 safe-area">
      {/* 头部 - 根据hideHeader参数决定是否显示 */}
      {!hideHeader && (
        <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            {/* Logo和标题 */}
            <div className="flex items-center space-x-2">
              <Logo size="small" mobileSize="small" />
              <span className="text-sm font-medium text-gray-700">
                众创医案
              </span>
            </div>
            
            {/* 用户状态区域 */}
            <div className="flex items-center space-x-2">
              {user ? (
                // 已登录状态
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 truncate max-w-[80px]">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                // 未登录状态
                <button
                  onClick={handleLogin}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  登录
                </button>
              )}
            </div>
          </div>
          
          {/* 移动端额外提示 */}
          <div className="text-center text-xs text-gray-500 mt-1">
            共享医学智慧
          </div>
        </header>
      )}

      {/* 主要内容区域 */}
      <main className={`pb-16 min-h-[calc(100vh-4rem)] overflow-y-auto ${hideHeader ? 'pt-4' : ''}`}>
        {/* 优先渲染 children，如果没有则渲染 Outlet */}
        {children || <Outlet />}
      </main>

      {/* 底部导航 */}
      <MobileBottomNav />
    </div>
  );
}