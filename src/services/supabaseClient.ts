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

// 创建 Supabase 客户端（修复锁冲突问题）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,           // 保持会话
    autoRefreshToken: true,         // 自动刷新 token
    detectSessionInUrl: true,       // 检测 URL 中的会话
    storage: localStorage,          // 使用 localStorage 存储 token
    storageKey: 'medical-platform-auth-token',  // ✅ 使用唯一的 key，避免多项目冲突
    lock: false                     // ✅ 禁用锁机制，避免多标签页冲突
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