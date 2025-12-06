import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { User } from '../types';
import Logo from './Logo/Logo'; // 新增导入Logo组件

interface MainLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const getDisplayName = () => {
    return user?.name || user?.username || '用户';
  };

  // 修复：使用正确的active状态检查（针对HashRouter）
  const isActive = (path: string) => {
    // HashRouter的location.hash包含#号
    return location.hash === `#${path}` || 
           (path === '/' && (location.hash === '#/' || location.hash === ''));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧logo和标题 - 已替换为可点击Logo */}
            <div className="flex items-center">
              <Logo size="medium" />
            </div>

            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                首页
              </Link>
              <Link 
                to="/cases" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/cases') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                医案库
              </Link>
              <Link 
                to="/community" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/community') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                社区
              </Link>
              <Link 
                to="/consultation" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/consultation') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                会诊
              </Link>
            </div>

            {/* 右侧用户功能区 */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700 text-sm">
                    欢迎，{getDisplayName()}医生
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo size="small" />
              <p className="mt-2 text-gray-600 text-sm">
                共享医学智慧，共创健康未来
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                © 2025 众创医案平台. 保留所有权利.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;