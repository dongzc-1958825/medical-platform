import React, { useState } from 'react';

const MobileConsultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [showExamples, setShowExamples] = useState(true);

  // 简化版的移动端寻医问药，可以后续完善
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">寻医问药</h1>

      {/* 标签切换 */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === 'list' ? 'bg-white shadow' : ''
          }`}
        >
          咨询列表
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === 'form' ? 'bg-white shadow' : ''
          }`}
        >
          发起咨询
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-4">
          {/* 简化版咨询列表 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">持续头痛3天</h3>
            <p className="text-sm text-gray-600 mb-2">紧急 · 3回复</p>
            <p className="text-xs text-gray-500">2小时前</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">咳嗽伴有发热</h3>
            <p className="text-sm text-gray-600 mb-2">普通 · 1回复</p>
            <p className="text-xs text-gray-500">昨天</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">胃部不适咨询</h3>
            <p className="text-sm text-gray-600 mb-2">已解决 · 5回复</p>
            <p className="text-xs text-gray-500">3天前</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">发起咨询</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主要症状
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="描述主要症状"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                详细描述
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="请详细描述症状、持续时间、相关病史等"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主要诉求
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="希望获得什么帮助"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                紧急程度
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="normal">普通</option>
                <option value="urgent">紧急</option>
                <option value="critical">危急</option>
              </select>
            </div>
            
            <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
              提交咨询
            </button>
            
            <div className="text-center">
              <button 
                onClick={() => setShowExamples(!showExamples)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showExamples ? '隐藏' : '显示'}咨询示例
              </button>
              
              {showExamples && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md text-left">
                  <p className="text-sm font-medium text-blue-800 mb-1">好的咨询示例：</p>
                  <p className="text-xs text-blue-600 mb-1">"持续头痛3天，主要集中在太阳穴，伴有轻微恶心，无发热。"</p>
                  <p className="text-xs text-blue-600">"希望了解可能的原因和缓解建议"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 底部提示 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>温馨提示：在线咨询不能替代面对面诊疗</p>
        <p className="text-xs mt-1">紧急情况请及时就医</p>
      </div>
    </div>
  );
};

export default MobileConsultPage;