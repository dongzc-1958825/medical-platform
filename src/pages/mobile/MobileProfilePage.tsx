// src/pages/mobile/MobileProfilePage.tsx
import React from 'react';
import MobileLayout from '../../components/MobileLayout';

const MobileProfilePage: React.FC = () => {
  return (
    <MobileLayout title="个人中心" showBack>
      <div className="p-4">
        <div className="text-center py-8 text-gray-500">
          个人中心页面 - 开发中
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileProfilePage;