import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText,      // ҽ������
  Stethoscope,   // Ѱҽ��ҩ
  Users,         // ר������
  MessageCircle, // ��Ϣ����
  User           // �ҵ�
} from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { 
      path: '/mobile/cases', 
      label: 'ҽ��', 
      icon: FileText 
    },
    { 
      path: '/mobile/consult', 
      label: '��ҩ', 
      icon: Stethoscope 
    },
    { 
      path: '/mobile/community', 
      label: '����', 
      icon: Users 
    },
    { 
      path: '/mobile/messages', 
      label: '��Ϣ', 
      icon: MessageCircle 
    },
    { 
      path: '/mobile/profile', 
      label: '�ҵ�', 
      icon: User 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
      <div className="flex justify-between items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center h-full min-w-0 px-1 ${
                  isActive 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-0.5 truncate w-full text-center">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
