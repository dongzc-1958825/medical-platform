// src/pages/mobile/MobileCasesPage.tsx - 语法修复版
import React from 'react';
import MobileLayout from '../../components/MobileLayout';

// 模拟数据 - 稍后可以替换为API调用
const mockCases = [
  {
    id: 1,
    title: '糖尿病患者长期管理成功案例',
    department: '内分泌科',
    doctor: '张华主任医师',
    date: '2025-12-05',
    views: 245,
    comments: 18,
    isBookmarked: true,
    excerpt: '通过个性化饮食和运动方案，患者血糖控制稳定...'
  },
  {
    id: 2,
    title: '高血压合并冠心病综合治疗方案',
    department: '心血管科',
    doctor: '李明副主任医师',
    date: '2025-12-04',
    views: 189,
    comments: 12,
    isBookmarked: false,
    excerpt: '结合药物治疗与生活方式干预，血压达标率提升至92%...'
  }
];

const MobileCasesPage: React.FC = () => {
  return (
    <MobileLayout title="医案分享" showBack={false}>
      <div className="pb-20">
        {/* 搜索栏 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索医案、疾病或科室..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span role="img" aria-label="搜索">🔍</span>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {['全部', '内分泌科', '心血管科', '热门', '最新'].map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  tag === '全部' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 医案卡片列表 */}
        <div className="space-y-4 p-4">
          {mockCases.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {caseItem.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {caseItem.department}
                      </span>
                      <span className="text-gray-500 text-sm">
                        <span role="img" aria-label="医生">👨‍⚕️</span> {caseItem.doctor}
                      </span>
                    </div>
                  </div>
                  <button className="ml-2">
                    {caseItem.isBookmarked ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">
                  {caseItem.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-4">
                    <span><span role="img" aria-label="浏览">👁️</span> {caseItem.views}</span>
                    <span><span role="img" aria-label="评论">💬</span> {caseItem.comments}</span>
                    <span><span role="img" aria-label="日期">📅</span> {caseItem.date}</span>
                  </div>
                  <button className="text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 浮动操作按钮 */}
        <button className="fixed bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <span role="img" aria-label="添加">➕</span>
        </button>
      </div>
    </MobileLayout>
  );
};

export default MobileCasesPage;
'@ | Out-File -FilePath "src/pages/mobile/MobileCasesPage.tsx" -Encoding UTF8 -NoNewline

Write-Host "✅ 语法修复版已应用" -ForegroundColor Green