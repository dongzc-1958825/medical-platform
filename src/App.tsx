// src/App.tsx - HashRouter兼容版本（解决GitHub Pages 404问题）
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import CreateCasePage from './pages/CreateCasePage';
import HelpPage from './pages/HelpPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import CommunityPage from './pages/CommunityPage';
import { User } from './types';

/**
 * HashRouter路由修复说明：
 * 1. 所有路由路径去掉开头的斜杠（如 path="login" 而不是 path="/login"）
 * 2. 独立路由（登录页、详情页）放在主布局路由之前
 * 3. 添加路由调试信息便于排查问题
 * 4. 处理认证状态的重定向逻辑
 */

// 路由调试组件（生产环境可移除）
const RouteDebugger = () => {
  const location = useLocation();
  
  useEffect(() => {
    // 只在开发环境显示调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 路由调试信息:', {
        hash: location.hash,
        pathname: location.pathname,
        search: location.search,
        key: location.key,
        // 提取hash中的实际路径
        hashPath: location.hash.substring(1),
        // 当前时间戳
        timestamp: new Date().toISOString()
      });
    }
  }, [location]);
  
  return null; // 不渲染任何内容
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查本地存储中的用户登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        // 详细的调试信息
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 认证状态检查:', { 
            hasToken: !!token,
            hasUserData: !!userData,
            tokenLength: token ? token.length : 0,
            userDataPreview: userData ? userData.substring(0, 100) + '...' : null
          });
        }
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ 找到用户数据:', parsedUser);
          }
          setUser(parsedUser);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('ℹ️ 未找到认证信息，用户未登录');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('❌ 检查认证状态时出错:', error);
        // 清除可能损坏的数据
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // 监听storage变化（多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理用户登录
  const handleLogin = (userData: User, token: string) => {
    console.log('👤 用户登录:', userData);
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // 处理用户退出
  const handleLogout = () => {
    console.log('👋 用户退出');
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // 更新用户信息
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // 保护路由组件 - 需要登录才能访问
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ProtectedRoute检查:', { user, loading });
    }
    
    return user ? <>{children}</> : <Navigate to="login" replace />;
  };

  // 公共路由组件 - 已登录用户访问登录页时重定向到首页
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    // 调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 PublicRoute检查:', { 
        user, 
        hasUser: !!user,
        loading,
        shouldRedirect: !!user
      });
    }
    
    // 🔧 问题排查模式：
    // 如果遇到登录页自动重定向问题，可以临时注释下一行，启用下面的强制显示
    return !user ? <>{children}</> : <Navigate to="/" replace />;
    
    // 🔧 临时解决方案（问题排查时使用）：
    // 如果登录页总是重定向到首页，取消下面这行的注释，注释掉上面一行
    // return <>{children}</>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    // 🔧 关键修复：添加 basename="/medical-platform"
    <Router basename="/medical-platform">
      {/* 路由调试器（开发环境有效） */}
      <RouteDebugger />
      
      <div className="App">
        <Routes>
          {/* 
            ======================
            独立路由（不在MainLayout内）
            ======================
            注意：HashRouter中路径不要以斜杠开头
          */}
          
          {/* 1. 登录页面 - 公共路由 */}
          <Route 
            path="login"  // 🔧 关键：不要写成 "/login"
            element={
              <PublicRoute>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            } 
          />
          
          {/* 2. 咨询详情页面 - 独立页面 */}
          <Route 
            path="consultation/:id"  // 🔧 关键：不要写成 "/consultation/:id"
            element={
              <ProtectedRoute>
                <ConsultationDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* 
            ======================
            主布局路由（包含大多数页面）
            ======================
            注意：path="/*" 会匹配所有未在前面匹配的路径
          */}
          <Route 
            path="/*" 
            element={
              <MainLayout user={user} onLogout={handleLogout} />
            }
          >
            {/* 首页 */}
            <Route index element={<HomePage user={user} />} />
            
            {/* 医案页面 */}
            <Route path="cases" element={
              <ProtectedRoute>
                <CasesPage />
              </ProtectedRoute>
            } />
            
            {/* 创建医案页面 */}
            <Route path="cases/create" element={
              <ProtectedRoute>
                <CreateCasePage />
              </ProtectedRoute>
            } />
            
            {/* 社区页面 */}
            <Route path="community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            
            {/* 帮助页面 */}
            <Route path="help" element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            } />
            
            {/* 消息页面 */}
            <Route path="messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            
            {/* 个人资料页面 */}
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage user={user} onUpdateUser={updateUser} />
              </ProtectedRoute>
            } />
            
            {/* 404重定向 - 在嵌套路由内部处理 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;