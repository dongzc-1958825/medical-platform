// src/components/Logo/Logo.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobileDevice } from '../../shared/utils/device';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  mobileSize?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', mobileSize }) => {
  const navigate = useNavigate();
  
  // 使用改进的设备检测函数
  const isMobile = isMobileDevice();
  
  // 尺寸配置
  const sizeConfig = {
    small: {
      container: 'h-8 w-8',
      text: 'text-base'
    },
    medium: {
      container: 'h-12 w-12',
      text: 'text-xl'
    },
    large: {
      container: 'h-16 w-16',
      text: 'text-2xl'
    }
  };

  const currentSize = sizeConfig[size];
  const mobileCurrentSize = mobileSize ? sizeConfig[mobileSize] : currentSize;

  // 处理Logo点击
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 根据设备类型跳转到对应的首页
    if (isMobile) {
      navigate('/mobile/cases', { replace: true });
    } else {
      navigate('/desktop/cases', { replace: true });
    }
  };

  return (
    <div 
      onClick={handleLogoClick}
      className="flex items-center space-x-3 no-underline hover:opacity-80 transition-opacity cursor-pointer"
      aria-label="返回医案平台首页"
    >
      {/* Logo图标容器 */}
      <div className={`
        ${currentSize.container}
        md:${mobileCurrentSize.container}
        flex items-center justify-center
      `}>
        <img
          src="/logo.png"
          alt="众创医案平台Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Logo文字 */}
      <div className="flex flex-col">
        <span className={`
          font-bold text-gray-800
          ${currentSize.text}
          hidden sm:block
        `}>
          众创医案平台
        </span>
        <span className="text-xs text-gray-500 hidden sm:block">
          共享医学智慧
        </span>
      </div>
    </div>
  );
};

export default Logo;
