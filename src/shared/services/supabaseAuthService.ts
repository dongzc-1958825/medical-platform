// src/shared/services/supabaseAuthService.ts
import { supabase } from './supabaseClient';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'super_admin';
  avatar?: string;
  phone?: string;
  created_at: string;
}

// 注册
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role: 'user' }
    }
  });
  
  if (error) return { success: false, error: error.message };
  
  // 同时在 user_profiles 表中创建记录
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: data.user.id,
        username: username,
        email: email,
        role: 'user'
      }]);
    
    if (profileError) {
      console.error('创建用户资料失败:', profileError);
    }
  }
  
  return { success: true, user: data.user };
};

// 登录
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) return { success: false, error: error.message };
  
  // 获取用户资料
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
      username: profile?.username || data.user.user_metadata?.username,
      role: profile?.role || 'user',
      created_at: data.user.created_at
    }
  };
};

// 退出登录
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return !error;
};

// 获取当前用户
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  return {
    id: session.user.id,
    email: session.user.email!,
    username: profile?.username || session.user.user_metadata?.username,
    role: profile?.role || 'user',
    created_at: session.user.created_at
  };
};

// 检查是否是超级管理员
export const isSuperAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'super_admin';
};
