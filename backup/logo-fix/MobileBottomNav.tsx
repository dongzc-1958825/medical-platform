import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Users, MessageCircle, User } from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { 
      path: '/mobile/home', 
      label: '首页', 
      icon: Home 
    },
    { 
      path: '/mobile/cases', 
      label: '医案分享', 
      icon: FileText 
    },
    { 
      path: '/mobile/community', 
      label: '专病社区', 
      icon: Users 
    },
    { 
      path: '/mobile/messages', 
      label: '消息中心', 
      icon: MessageCircle 
    },
    { 
      path: '/mobile/profile', 
      label: '我的', 
      icon: User 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full ${
                  isActive 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-blue-500'
                } transition-colors duration-200`
              }
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}