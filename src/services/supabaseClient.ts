// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// 从环境变量读取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 验证环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 配置缺失！请检查环境变量：');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl);
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '已设置' : '未设置');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage  // 存储 session 到 localStorage（仅用于 token）
  }
});

// 辅助函数：检查连接是否正常
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase 连接成功');
    return true;
  } catch (error) {
    console.error('❌ Supabase 连接失败:', error);
    return false;
  }
};