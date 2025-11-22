import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { User } from '../types';

interface MainLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getDisplayName = () => {
    return user?.name || user?.username || '用户';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧logo和标题 */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl mr-2">🏥</span>
                <h1 className="text-xl font-bold text-gray-800">众创医案平台</h1>
              </div>
              
              {/* 欢迎文本 */}
              {user && (
                <div className="ml-6 text-sm text-gray-600">
                  欢迎，{getDisplayName()}
                </div>
              )}
            </div>

            {/* 右侧导航菜单 */}
            <div className="flex items-center space-x-1">
              {/* 主导航链接 */}
              <button
                onClick={() => handleNavigation('/')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                🏠 首页
              </button>
              
              <button
                onClick={() => handleNavigation('/cases')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/cases' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📋 医案分享
              </button>
              
              <button
                onClick={() => handleNavigation('/community')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/community' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                👥 专病社区
              </button>
              
              <button
                onClick={() => handleNavigation('/help')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/help' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ❓ 寻医问药
              </button>
              
              <button
                onClick={() => handleNavigation('/messages')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/messages' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📢 消息
              </button>
              
              <button
                onClick={() => handleNavigation('/profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/profile' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                👤 我的
              </button>

              {/* 用户相关操作 */}
              <div className="ml-4 flex items-center space-x-2">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">{getDisplayName()}</span>
                    <button
                      onClick={onLogout}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    登录/注册
                  </button>
                )}
                
                {/* 语言切换 */}
                <button className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1">
                  中/EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 - 使用 Outlet 渲染子路由 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;