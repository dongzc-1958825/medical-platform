import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import WelcomePage from './components/layout/WelcomePage';
import AuthModal from './components/auth/AuthModal';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import { getUserStats, validateUser, isUsernameExists, addUser, getUserById, deleteUser } from './utils/userService';

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [userStats, setUserStats] = useState({ totalUsers: 0, recentUsers: [] as UserProfile[] });

  // 检查登录状态和更新用户统计
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('medical_token');
        const userId = localStorage.getItem('medical_user_id');
        
        if (token && userId) {
          const user = getUserById(userId);
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
        localStorage.removeItem('medical_token');
        localStorage.removeItem('medical_user_id');
      }
    };

    checkAuthStatus();
    setUserStats(getUserStats());
  }, []);

  const handleLogin = async (formData: any, isLoginMode: boolean) => {
    setIsLoading(true);
    setFormErrors({});

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (isLoginMode) {
        // 登录逻辑
        const user = validateUser(formData.username, formData.password);
        
        if (!user) {
          setFormErrors({ password: '用户名或密码错误' });
          return;
        }

        // 保存登录状态
        const token = 'medical_token_' + Date.now();
        localStorage.setItem('medical_token', token);
        localStorage.setItem('medical_user_id', user.id);
        
        setCurrentUser(user);
        setShowAuthModal(false);
        alert('登录成功！');

      } else {
        // 注册逻辑
        if (isUsernameExists(formData.username)) {
          setFormErrors({ username: '该用户名已存在' });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setFormErrors({ confirmPassword: '密码确认不一致' });
          return;
        }

        // 使用新的addUser函数
        const newUser = addUser({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          idCard: formData.idCard,
          password: formData.password
        });

        // 保存登录状态
        const token = 'medical_token_' + Date.now();
        localStorage.setItem('medical_token', token);
        localStorage.setItem('medical_user_id', newUser.id);
        
        setCurrentUser(newUser);
        setUserStats(getUserStats());
        setShowAuthModal(false);
        alert('注册成功！欢迎加入医案平台！');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medical_token');
    localStorage.removeItem('medical_user_id');
    setCurrentUser(null);
    setUserStats(getUserStats());
    alert('已退出登录');
  };

  // 处理找回密码
  const handleForgotPassword = () => {
    setShowAuthModal(false);
    setShowForgotPasswordModal(true);
  };

  // 找回密码成功后的处理
  const handlePasswordResetSuccess = () => {
    setShowForgotPasswordModal(false);
    setShowAuthModal(true);
    setIsLogin(true);
    alert('请使用临时密码登录，并及时修改密码！');
  };

  // ✅ 新增：处理用户注销
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    
    const confirmDelete = window.confirm(
      '⚠️ 确定要注销账号吗？\n\n此操作将：\n• 永久删除您的所有数据\n• 无法恢复\n• 需要重新注册才能使用\n\n请输入"确认注销"以继续：'
    );
    
    if (!confirmDelete) return;
    
    const userInput = prompt('请输入"确认注销"以完成账号注销：');
    if (userInput !== '确认注销') {
      alert('输入错误，注销操作已取消');
      return;
    }
    
    const success = deleteUser(currentUser.id);
    if (success) {
      setCurrentUser(null);
      setUserStats(getUserStats());
      alert('账号已成功注销，感谢您使用众创医案平台！');
    } else {
      alert('注销失败，请稍后重试');
    }
  };

  // 如果用户已登录，显示主应用
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">医</div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">众创医案平台</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">欢迎，{currentUser.username}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  退出
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">登录成功！</h2>
            <p className="text-gray-600 mb-8">准备进入主应用...</p>
            
            {/* 用户统计信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto mb-6">
              <h3 className="text-lg font-semibold mb-4">平台统计</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalUsers}</div>
                  <div className="text-sm text-gray-600">总用户数</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{currentUser.medicalCases}</div>
                  <div className="text-sm text-gray-600">我的医案</div>
                </div>
              </div>
            </div>

            {/* ✅ 新增：账号管理区域 */}
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-red-600">账号管理</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🚪 退出登录
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ 注销账号
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                注意：注销账号将永久删除所有数据，无法恢复！
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 用户未登录，显示欢迎页面
  return (
    <>
      <WelcomePage onLogin={() => setShowAuthModal(true)} />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setFormErrors({});
        }}
        isLogin={isLogin}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onSwitchMode={() => setIsLogin(!isLogin)}
        onForgotPassword={handleForgotPassword}
        formErrors={formErrors}
      />

      {/* 找回密码弹窗 */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handlePasswordResetSuccess}
      />
    </>
  );
}

export default App;