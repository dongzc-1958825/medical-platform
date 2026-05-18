// src/shared/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 配置，请检查 .env 文件');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 测试连接
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase 连接成功！');
    return true;
  } catch (error) {
    console.error('❌ Supabase 连接失败:', error);
    return false;
  }
};
