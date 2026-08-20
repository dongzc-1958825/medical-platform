// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { isMobileDevice } from '@/shared/utils/device';
import { LogIn, UserPlus, ArrowLeft, X } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [idCard, setIdCard] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remark, setRemark] = useState('');
  const [idCardError, setIdCardError] = useState('');
  const [idCardCorrected, setIdCardCorrected] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // 忘记密码相关状态
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    let formType = null;
    if (hash.includes('?')) {
      const [path, query] = hash.split('?');
      const params = new URLSearchParams(query);
      formType = params.get('form');
    }
    setIsRegister(formType === 'register');
  }, [location]);

  const handleIdCardChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^0-9X]/g, '');
    setIdCard(cleaned);
    setIdCardError('');
    setIdCardCorrected('');
  };

  const validateIdCard = () => {
    if (!idCard || idCard.length !== 18) {
      setIdCardError('身份证号必须为18位');
      return false;
    }
    if (!/^\d{17}[\dX]$/.test(idCard)) {
      setIdCardError('身份证号格式不正确');
      return false;
    }
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * factor[i];
    }
    const mod = sum % 11;
    const expectedParity = parity[mod];
    if (idCard[17] !== expectedParity) {
      const corrected = idCard.substring(0, 17) + expectedParity;
      setIdCardCorrected(corrected);
      setIdCardError('校验码错误，已自动修正');
      return false;
    }
    return true;
  };

  const validatePhone = (phoneNum: string) => {
    return /^1[3-9]\d{9}$/.test(phoneNum);
  };

  // ✅ 登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('请输入邮箱');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      setMessage(`欢迎回来，${data.user?.email || '用户'}！`);
      setTimeout(() => {
        const redirectPath = isMobileDevice() ? '/mobile/home' : '/desktop/home';
        navigate(redirectPath);
      }, 1000);
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱或密码');
    }
  };

  // ✅ 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim()) {
      setError('请输入真实姓名');
      return;
    }
    if (!idCard || idCard.length !== 18) {
      setError('请输入18位身份证号');
      return;
    }
    if (!validateIdCard()) return;
    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    if (!validatePhone(phone)) {
      setError('请输入正确的11位手机号码');
      return;
    }
    if (password.length < 8) {
      setError('密码长度至少8位');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('密码必须包含至少一个大写字母');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('密码必须包含至少一个数字');
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError('密码必须包含至少一个特殊字符 (!@#$%^&*)');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      console.log('📝 === REGISTER START ===');
      console.log('📧 邮箱:', email);
      console.log('👤 用户名:', username);
      console.log('🔑 密码长度:', password.length);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            username: username.trim(),
            role: 'patient'
          }
        }
      });

      console.log('📝 Supabase 注册响应:', { 
        user: data.user?.id, 
        session: data.session ? '有会话' : '无会话',
        error: signUpError?.message || null
      });

      if (signUpError) {
        console.error('❌ 注册失败:', signUpError);
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        console.log('✅ 用户创建成功，ID:', data.user.id);
        
        // ✅ 带重试的 profiles 插入
        let profileCreated = false;
        let lastError = null;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`📝 尝试创建 profile (第 ${attempt} 次)...`);
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username.trim(),
              email: email.trim(),
              phone: phone,
              role: 'patient',
              created_at: new Date().toISOString()
            });

          if (!profileError) {
            profileCreated = true;
            console.log('✅ Profile 创建成功');
            break;
          }
          
          lastError = profileError;
          console.warn(`⚠️ 第 ${attempt} 次创建失败:`, profileError.message);
          
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        if (!profileCreated) {
          console.error('❌ 创建 profile 失败（重试3次）:', lastError);
          setError('注册成功，但资料保存失败，请联系管理员');
        }

        setMessage('🎉 注册成功！请登录...');
        setTimeout(() => {
          setIsRegister(false);
          setMessage('');
          setEmail('');
          setPassword('');
        }, 2000);
      } else {
        console.log('⚠️ 注册响应中没有用户数据');
        setError('注册失败，请重试');
      }
    } catch (err: any) {
      console.error('❌ 注册异常:', err);
      setError(err.message || '注册失败，请重试');
    }
  };

  // ✅ 忘记密码：发送重置邮件
  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError('请输入邮箱');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: 'https://dongzc-1958825.github.io/medical-platform/#/mobile/reset-password',
      });

      if (error) throw error;

      setResetMessage('✅ 重置链接已发送！请检查您的邮箱（包括垃圾邮件箱）');
      setResetEmail('');
      
      // 3秒后自动关闭弹窗
      setTimeout(() => {
        setShowResetPassword(false);
        setResetMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('❌ 发送重置邮件失败:', err);
      setResetError(err.message || '发送失败，请重试');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${isRegister ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isRegister ? (
                <UserPlus className="w-10 h-10 text-green-600" />
              ) : (
                <LogIn className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? '实名注册' : '欢迎回来'}
          </h1>
          <p className="text-gray-600">
            {isRegister ? '填写真实信息以完成注册' : '使用您的邮箱登录'}
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              !isRegister 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              isRegister 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isRegister ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">真实姓名 *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="输入真实姓名"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身份证号 *</label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => handleIdCardChange(e.target.value)}
                onBlur={validateIdCard}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  idCardError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="18位身份证号码"
                maxLength={18}
                required
              />
              {idCardError && <p className="text-red-500 text-xs mt-1">{idCardError}</p>}
              {idCardCorrected && <p className="text-green-500 text-xs mt-1">已自动修正为：{idCardCorrected}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号 *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="11位手机号码"
                maxLength={11}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码 *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="设置密码"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">确认密码 *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="再次输入密码"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="选填：职业、科室等补充信息"
                rows={2}
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:opacity-90">
              注册
            </button>
            <div className="text-center pt-4">
              <button type="button" onClick={() => setIsRegister(false)} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4 mr-1" />已有账户？返回登录
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的邮箱"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                required
              />
            </div>
            
            {/* ✅ 忘记密码链接 */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                忘记密码？
              </button>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90">
              登录
            </button>
            <div className="text-center pt-4">
              <button type="button" onClick={() => setIsRegister(true)} className="text-sm text-blue-600 hover:text-blue-800">
                没有账户？立即注册
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ✅ 忘记密码弹窗 */}
      {showResetPassword && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResetPassword(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setShowResetPassword(false);
                setResetMessage('');
                setResetError('');
                setResetEmail('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">重置密码</h2>
            <p className="text-gray-600 mb-6">
              输入您的邮箱，我们将发送密码重置链接
            </p>

            {resetMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {resetMessage}
              </div>
            )}

            {resetError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {resetError}
              </div>
            )}

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mb-4"
              disabled={resetLoading}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetMessage('');
                  setResetError('');
                  setResetEmail('');
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                disabled={resetLoading}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading || !resetEmail.trim()}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? '发送中...' : '发送重置链接'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;