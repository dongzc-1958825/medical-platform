// ========== 生产环境调试代码开始 ==========
console.log('🔍 [DEBUG] main.tsx 开始执行');
console.log('📅 时间:', new Date().toISOString());
console.log('🌐 环境:', import.meta.env.MODE);
console.log('📍 BASE_URL:', import.meta.env.BASE_URL);
console.log('🔗 当前URL:', window.location.href);
console.log('🎯 根元素存在:', !!document.getElementById('root'));
// ========== 调试代码结束 ==========

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('⚛️ [DEBUG] React库状态检查:');
console.log('- React:', typeof React);
console.log('- ReactDOM:', typeof ReactDOM);
console.log('- App组件:', typeof App);

try {
  console.log('🎯 [DEBUG] 准备创建React根节点');
  const rootElement = document.getElementById('root');
  console.log('🎯 根元素详情:', rootElement);
  
  if (!rootElement) {
    throw new Error('找不到 #root 元素');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  console.log('✅ [DEBUG] React根节点创建成功');
  
  console.log('🚀 [DEBUG] 开始渲染App组件');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('🎉 [DEBUG] React渲染完成');
} catch (error) {
  console.error('❌ [DEBUG] React初始化失败:', error);
  // 显示错误信息
  const errorElement = document.getElementById('root');
  if (errorElement) {
    errorElement.innerHTML = `
      <div style="padding: 30px; background: #fee; border: 3px solid red; border-radius: 8px; margin: 20px;">
        <h2 style="color: #c00; margin-top: 0;">React初始化错误</h2>
        <pre style="background: #fff; padding: 15px; border-radius: 4px; overflow: auto;">
${error instanceof Error ? error.stack : String(error)}
        </pre>
        <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          重新加载页面
        </button>
      </div>
    `;
  }
}

// 全局错误捕获
window.addEventListener('error', (event) => {
  console.error('🆘 [DEBUG] 全局错误捕获:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🆘 [DEBUG] 未处理的Promise错误:', event.reason);
});