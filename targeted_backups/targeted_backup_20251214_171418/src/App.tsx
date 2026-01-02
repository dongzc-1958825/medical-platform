import * as React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// 移动端布局与页面
import MobileLayout from "./components/layout/MobileLayout";
import MobileCasesPage from "./pages/mobile/MobileCasesPage";
import MobileCommunityPage from "./pages/mobile/MobileCommunityPage";
import MobileConsultPage from "./pages/mobile/MobileConsultPage";
import MobileMessagesPage from "./pages/mobile/MobileMessagesPage";
import MobileProfilePage from "./pages/mobile/MobileProfilePage";

// 桌面端布局与页面
import DesktopLayout from "./components/layout/DesktopLayout";
import CasesPage from "./pages/CasesPage";
import CommunityPage from "./pages/CommunityPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

// 简单的设备检测函数
const isMobileDevice = (): boolean => {
  // 检查屏幕宽度，小于等于768px视为移动设备
  return window.innerWidth <= 768;
};

// 设备检测路由组件
const DeviceAwareRedirect = () => {
  const mobile = isMobileDevice();
  return <Navigate to={mobile ? "/mobile/cases" : "/desktop/cases"} replace />;
};

// 包装组件：简化版本的 ProfilePage
const DesktopProfilePageWrapper = () => {
  // 创建包含所有可能属性的完整 mock 用户对象
  //   const mockUser = {
  //     // 来自 src/types/index.ts 的属性
  //     id: '1',
  //     username: 'doctor_zhang',
  //     email: 'doctor@example.com',
  //     password: 'hashed_password',
  //     joinTime: '2023-01-15T08:30:00Z',
  //     medicalCases: 87,
  //     consultations: 10,
  //     role: 'doctor' as const,
  //     isActive: true,
  //     name: '测试医生',
  //     avatar: '',
  //     phone: '13800138000',
  //     birthDate: '1980-05-15',
  //     gender: 'male' as const,
  //     medicalHistory: '无重大病史',
  //     allergies: ['青霉素'],
  //     createdAt: '2023-01-15T08:30:00Z',
  //     
  //     // 来自 src/shared/types/user.ts 的属性
  //     followersCount: 1250,
  //     followingCount: 320,
  //     casesCount: 87,
  //     contributions: 95,
  //     isVerified: true,
  //     updatedAt: '2024-12-01T14:20:00Z',
  //     lastLoginAt: '2024-12-14T09:15:00Z',
  //     bio: '资深内科医生，擅长中医治疗',
  //     title: '主任医师',
  //     hospital: '北京协和医院',
  //     department: '内科',
  //     specialties: ['内科', '中医', '消化内科'],
  //     qualification: '国家执业医师资格证',
  //     yearsOfExperience: 15,
  //     
  //     // 设置（来自 src/shared/types/user.ts）
  //     settings: {
  //       notifications: {
  //         email: true,
  //         push: true,
  //         comments: true,
  //         likes: true,
  //         collections: true
  //       },
  //       privacy: {
  //         showRealName: true,
  //         showContactInfo: false,
  //         allowPrivateMessages: true,
  //         showOnlineStatus: true
  //       },
  //       display: {
  //         theme: 'light' as const,
  //         fontSize: 'medium' as const,
  //         language: 'zh-CN'
  //       }
  //     }
  //   };
  
  
  
return <ProfilePage />;
};

// 包装组件：简化版本的 LoginPage
const DesktopLoginPageWrapper = () => {
  const handleLogin = (credentials: any) => {
    console.log('登录:', credentials);
    // 实际应用中这里应该处理登录逻辑
    // 登录成功后重定向
    window.location.href = '/desktop/cases';
  };
  
  const handleCancel = () => {
    console.log('取消登录');
    // 返回首页
    window.location.href = '/';
  };
  
  return <LoginPage onLogin={handleLogin} onCancel={handleCancel} />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 根路径根据设备类型重定向 */}
        <Route path="/" element={<DeviceAwareRedirect />} />
        
        {/* 移动端路由 */}
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<Navigate to="/mobile/cases" />} />
          <Route path="cases" element={<MobileCasesPage />} />
          <Route path="community" element={<MobileCommunityPage />} />
          <Route path="consult" element={<MobileConsultPage />} />
          <Route path="messages" element={<MobileMessagesPage />} />
          <Route path="profile" element={<MobileProfilePage />} />
        </Route>
        
        {/* 桌面端路由 */}
        <Route path="/desktop" element={<DesktopLayout />}>
          <Route index element={<Navigate to="/desktop/cases" />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<DesktopProfilePageWrapper />} />
          <Route path="login" element={<DesktopLoginPageWrapper />} />
          <Route path="home" element={<HomePage />} />
        </Route>
        
        {/* 通用路由重定向 */}
        <Route path="/cases" element={<DeviceAwareRedirect />} />
        <Route path="/login" element={<Navigate to="/desktop/login" />} />
        
        {/* 404 回退到设备对应的首页 */}
        <Route path="*" element={<DeviceAwareRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
