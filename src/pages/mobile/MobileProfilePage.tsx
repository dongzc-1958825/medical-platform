// src/pages/mobile/MobileProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 使用统一的认证
// ❌ 移除这行：import MobileLayout from '../../components/layout/MobileLayout';
import { Heart, FileText, Stethoscope, Key, Star, ChevronRight, User, Settings } from 'lucide-react';

export default function MobileProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 使用统一的认证状态
  
  // 5个核心功能
  const coreFeatures = [
    { 
      icon: Heart, 
      label: '健康管理', 
      description: '管理您的健康数据',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      path: '/mobile/health'
    },
    { 
      icon: FileText, 
      label: '诊疗记录', 
      description: '查看和管理就诊记录',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      path: '/mobile/records'
    },
    { 
      icon: Stethoscope, 
      label: '体检报告', 
      description: '上传和查看体检报告',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      path: '/mobile/reports'
    },
    { 
      icon: Key, 
      label: '关键信息', 
      description: '重要医疗信息和联系人',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      path: '/mobile/keyinfo'
    },
    { 
      icon: Star, 
      label: '我的收藏', 
      description: '收藏的医案和文章',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      path: '/mobile/favorites'
    },
  ];

  const settingsFeatures = [
    { icon: User, label: '个人信息', path: '/mobile/profile/info' },
    { icon: Settings, label: '账户设置', path: '/mobile/settings' },
  ];

  // 获取用户显示名称
  const getDisplayName = () => {
    if (!user) return '用户';
    return user.username || user.email?.split('@')[0] || '用户';
  };

  // 获取首字母
  const getInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // 重要修改：移除未登录状态的独立页面
  // 这个页面应该被 AuthGuard 保护，所以用户一定存在
  // 如果未登录，AuthGuard 会重定向到登录页

  return (
    // ❌ 移除：<MobileLayout>
    <div className="p-4">
      {/* 用户信息卡片 - 只在 MobileLayout 的Header不够明显时显示 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {getInitial()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {getDisplayName()}
            </h2>
            <p className="text-sm text-white/80">
              {user?.email ? user.email : '欢迎使用众创医案'}
            </p>
          </div>
          {/* 注意：MobileLayout 顶部已经有退出按钮，这里可以省略或改为其他功能 */}
          <button
            onClick={() => navigate('/mobile/profile/edit')}
            className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            编辑
          </button>
        </div>
      </div>

      {/* 5个核心功能列表 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">我的功能</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {coreFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => {
                  // 所有功能都需要登录，但这里用户一定已登录（由AuthGuard保护）
                  navigate(item.path);
                }}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mr-3`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 设置功能 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">账户设置</h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {settingsFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors active:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
        <p>众创医案平台 v1.0</p>
        <p className="mt-1">数据安全加密存储</p>
      </div>
    </div>
    // ❌ 移除：</MobileLayout>
  );
}