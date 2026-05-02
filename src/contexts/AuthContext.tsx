// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, checkSupabaseConnection } from "../services/supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
  logout: () => Promise<void>;
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
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 辅助函数：从 Supabase 用户获取用户资料
const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    console.log('🔍 查询用户资料，ID:', supabaseUser.id);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .maybeSingle();  // 使用 maybeSingle() 而不是 single()
    
    if (error) {
      console.error('❌ 查询用户资料出错:', error);
      // 出错时返回基本用户信息
      return {
        id: supabaseUser.id,
        username: supabaseUser.email?.split("@")[0] || "",
        email: supabaseUser.email || "",
        role: "patient",
      };
    }
    
    if (data) {
      console.log('✅ 找到用户资料:', data);
      return {
        id: supabaseUser.id,
        username: data.username || supabaseUser.email?.split("@")[0] || "",
        idCard: data.idCard || "",
        email: supabaseUser.email || "",
        phone: data.phone || "",
        role: data.role || "patient",
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
        specialties: data.specialties || [],
        remark: data.remark || "",
        createdAt: data.createdAt || supabaseUser.created_at,
        updatedAt: data.updatedAt || "",
      };
    }
    
    // 没有找到资料，返回基本用户信息
    console.log('⚠️ 没有找到用户资料，使用默认值');
    return {
      id: supabaseUser.id,
      username: supabaseUser.email?.split("@")[0] || "",
      email: supabaseUser.email || "",
      role: "patient",
    };
  } catch (error) {
    console.error('❌ 获取用户资料异常:', error);
    return {
      id: supabaseUser.id,
      username: supabaseUser.email?.split("@")[0] || "",
      email: supabaseUser.email || "",
      role: "patient",
    };
  }
};

// 辅助函数：创建或更新用户资料
const upsertProfile = async (user: SupabaseUser, userData: Partial<User>) => {
  const profile = {
    id: user.id,
    username: userData.username || user.email?.split("@")[0] || "",
    idCard: userData.idCard || "",
    email: user.email,
    phone: userData.phone || "",
    role: userData.role || "patient",
    avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    specialties: userData.specialties || [],
    remark: userData.remark || "",
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" });

  if (error) {
    console.error("❌ 保存用户资料失败:", error);
    throw error;
  }

  return profile;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：检查 Supabase 登录状态
  useEffect(() => {
    const initAuth = async () => {
      console.log("🔄 AuthContext - 初始化 Supabase 认证");
      
      // 检查连接
      await checkSupabaseConnection();
      
      // 获取当前会话
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("✅ 找到现有会话，加载用户资料:", session.user.email);
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          setUser(profile);
        }
      } else {
        console.log("ℹ️ 没有保存的登录会话");
      }
      
      setIsLoading(false);
    };

    initAuth();

    // 监听 Supabase 认证状态变化
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Supabase 认证状态变化:", _event);
      
      if (session?.user) {
        console.log("✅ 用户已登录:", session.user.email);
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          setUser(profile);
        }
      } else {
        console.log("👋 用户已登出");
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 === LOGIN START ===");
      console.log("📧 登录邮箱:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error("❌ 登录失败:", error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        console.log("✅ 登录成功:", data.user.email);
        const profile = await fetchUserProfile(data.user);
        
        if (profile) {
          setUser(profile);
          return { success: true, user: profile };
        }
        
        // 如果没有 profile，创建一个基本的
        const basicProfile: User = {
          id: data.user.id,
          username: data.user.email?.split("@")[0] || "",
          email: data.user.email || "",
          role: "patient",
        };
        setUser(basicProfile);
        return { success: true, user: basicProfile };
      }

      return { success: false, message: "登录失败" };
    } catch (error) {
      console.error("❌ 登录异常:", error);
      return { success: false, message: "登录失败，请重试" };
    }
  };

  // 登出
  const logout = async () => {
    console.log("🚪 === LOGOUT START ===");
    console.log("👤 退出用户:", user?.username);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("❌ 登出失败:", error);
    } else {
      console.log("✅ 登出成功");
      setUser(null);
    }
  };

  // 注册
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

      // 检查邮箱是否已存在
      const { data: existingUsers, error: checkError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", userData.email);

      if (checkError) {
        console.error("❌ 检查用户失败:", checkError);
      }

      if (existingUsers && existingUsers.length > 0) {
        console.log("📝 用户已存在，尝试登录");
        return { success: false, message: "该邮箱已注册，请直接登录" };
      }

      // 注册新用户
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            role: userData.role,
          },
        },
      });

      if (signUpError) {
        console.error("❌ 注册失败:", signUpError.message);
        return { success: false, message: signUpError.message };
      }

      if (data.user) {
        console.log("✅ 注册成功:", data.user.email);
        
        // 创建用户资料
        await upsertProfile(data.user, userData);
        
        // 自动登录
        const profile = await fetchUserProfile(data.user);
        if (profile) {
          setUser(profile);
        }
        
        console.log("🎉 === REGISTER SUCCESS ===");
        return { success: true, message: "注册成功" };
      }

      return { success: false, message: "注册失败" };
    } catch (error) {
      console.error("❌ 注册异常:", error);
      return { success: false, message: "注册失败，请重试" };
    }
  };

  // 更新个人资料
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      console.error("❌ 未登录，无法更新资料");
      return;
    }

    try {
      console.log("✏️ === UPDATE PROFILE START ===");
      
      // 获取当前 Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("❌ 无效的 session");
        return;
      }

      const profile = {
        id: session.user.id,
        username: userData.username || user.username,
        idCard: userData.idCard || user.idCard,
        phone: userData.phone || user.phone,
        role: userData.role || user.role,
        avatar: userData.avatar || user.avatar,
        specialties: userData.specialties || user.specialties,
        remark: userData.remark || user.remark,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profile, { onConflict: "id" });

      if (error) {
        console.error("❌ 更新资料失败:", error);
        return;
      }

      // 更新本地 user 状态
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      
      console.log("✅ 个人资料更新成功");
    } catch (error) {
      console.error("❌ 更新资料异常:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};