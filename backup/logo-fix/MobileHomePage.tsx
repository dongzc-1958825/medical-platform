// src/pages/mobile/MobileHomePage.tsx
import React from 'react'; // 移除 useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus, Heart, FileText, Users, MessageSquare } from 'lucide-react';
import MobileLayout from '../../components/layout/MobileLayout';

const MobileHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login'); // 跳转到登录页（可显示注册表单）
  };

  // 如果已登录，显示跳转到个人中心的选项
  const handleGoToProfile = () => {
    navigate('/mobile/profile');
  };

  // 核心功能入口
  const coreFeatures = [
    {
      icon: FileText,
      title: '医案分享',
      description: '查看与分享临床案例',
      path: '/mobile/cases',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      requiresAuth: true // 需要登录
    },
    {
      icon: MessageSquare,
      title: '寻医问药',
      description: '在线咨询与交流',
      path: '/mobile/consult',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      requiresAuth: true
    },
    {
      icon: Users,
      title: '专病社区',
      description: '病种专题讨论',
      path: '/mobile/community',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      requiresAuth: true
    },
    {
      icon: Heart,
      title: '个人中心',
      description: '我的信息与设置',
      path: '/mobile/profile',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      requiresAuth: true
    },
  ];

  // 处理功能点击
  const handleFeatureClick = (feature: any) => {
    if (feature.requiresAuth && !user) {
      navigate('/login'); // 需要登录但未登录，跳转到登录页
    } else {
      navigate(feature.path);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4">
        {/* 欢迎区域 */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            欢迎{user ? `，${user.name || '用户'}` : '来到众创医案'}
          </h1>
          <p className="text-gray-600">
            {user ? '继续您的医学探索之旅' : '医疗知识，人人共享'}
          </p>
        </div>

        {/* 已登录用户的快捷入口 */}
        {user && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">已登录</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={handleGoToProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                个人中心
              </button>
            </div>
          </div>
        )}

        {/* 未登录时的登录提示 */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">👨‍⚕️</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                立即加入众创医案
              </h2>
              <p className="text-sm text-gray-600">
                登录后使用完整功能
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">登录</span>
              </button>
              
              <button
                onClick={handleRegister}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">注册</span>
              </button>
            </div>
          </div>
        )}

        {/* 核心功能网格 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            核心功能
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleFeatureClick(feature)}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                  {feature.requiresAuth && !user && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600">需要登录</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 平台价值描述 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-medium text-gray-800 mb-3">平台价值</h3>
          <ul className="space-y-2">
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              医患共建，知识共享
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              真实案例，临床参考
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              专业讨论，共同成长
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              数据安全，隐私保护
            </li>
          </ul>
        </div>

        {/* 测试账号提示 */}
        {!user && (
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>测试账号: test@example.com 密码: 123456</p>
            <p className="mt-1">或 doctor@example.com 密码: 123456</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MobileHomePage;