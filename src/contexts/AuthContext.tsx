// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  username: string;
  idCard?: string;
  email: string;
  phone?: string;
  role: "patient" | "doctor" | "admin" | "super_admin";
  avatar?: string;
  specialties?: string[];
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  register: (userData: {
    username: string;
    idCard?: string;
    email: string;
    phone?: string;
    password: string;
    remark?: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 导入 Supabase 认证服务
import { signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, getCurrentUser, isSuperAdmin } from "../shared/services/supabaseAuthService";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：从 Supabase 加载当前登录用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("🔄 AuthContext - 初始化，尝试恢复登录状态");
        
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          console.log("✅ 恢复当前用户:", currentUser.username);
          setUser(currentUser);
        } else {
          console.log("ℹ️ 没有保存的登录状态");
        }
      } catch (error) {
        console.error("❌ 加载用户信息失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 === LOGIN START ===");
      console.log("👤 登录邮箱:", email);
      console.log("🔑 登录密码:", password);

      const result = await supabaseSignIn(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        console.log("✅ 登录成功，用户:", result.user.username);
        return { success: true, user: result.user };
      } else {
        console.log("❌ 登录失败:", result.error);
        return { success: false, message: result.error || "登录失败" };
      }
    } catch (error) {
      console.error("❌ 登录失败:", error);
      return { success: false, message: "登录失败，请重试" };
    }
  };

  const logout = async () => {
    console.log("🚪 === LOGOUT START ===");
    console.log("👤 退出用户:", user?.username);
    
    await supabaseSignOut();
    setUser(null);
    
    console.log("✅ 当前登录状态已清理");
    // 跳转到登录页
    window.location.hash = '#/login';
  };

  const register = async (userData: {
    username: string;
    idCard?: string;
    email: string;
    phone?: string;
    password: string;
    remark?: string;
    role: "patient" | "doctor";
    specialties?: string[];
  }) => {
    try {
      console.log("🚀 === REGISTER START ===");
      console.log("📧 注册邮箱:", userData.email);
      console.log("👤 注册姓名:", userData.username);

      const result = await supabaseSignUp(userData.email, userData.password, userData.username);
      
      if (result.success && result.user) {
        // 注册成功后自动登录
        const loginResult = await supabaseSignIn(userData.email, userData.password);
        if (loginResult.success && loginResult.user) {
          setUser(loginResult.user);
        }
        console.log("🎉 注册成功！");
        return { success: true };
      } else {
        console.log("❌ 注册失败:", result.error);
        return { success: false, message: result.error || "注册失败，请重试" };
      }
    } catch (error) {
      console.error("❌ 注册失败:", error);
      return { success: false, message: "注册失败，请重试" };
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    // TODO: 实现更新 Supabase 用户资料
    // 目前先更新本地状态
    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
    setUser(updatedUser);
    
    console.log("📝 更新用户资料:", updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};