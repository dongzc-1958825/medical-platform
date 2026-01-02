# 3. 创建正确的 MobileMessagesPage.tsx
$correctCode = @'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import MobileLayout from '../../components/layout/MobileLayout';
import { Bell, Pin, Heart, MessageCircle, Eye, ChevronRight, Filter } from 'lucide-react';

// 消息类型定义
const MESSAGE_TYPES = {
  drug: { 
    icon: '💊', 
    label: '新药信息', 
    count: 12, 
    color: 'bg-blue-50 text-blue-600 border-blue-200' 
  },
  article: { 
    icon: '📚', 
    label: '专业文章', 
    count: 8, 
    color: 'bg-purple-50 text-purple-600 border-purple-200' 
  },
  announcement: { 
    icon: '📢', 
    label: '公告发布', 
    count: 5, 
    color: 'bg-green-50 text-green-600 border-green-200' 
  },
  effect: { 
    icon: '🌟', 
    label: '特效分享', 
    count: 15, 
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200' 
  },
  warning: { 
    icon: '⚠️', 
    label: '前车之鉴', 
    count: 7, 
    color: 'bg-red-50 text-red-600 border-red-200' 
  }
};

// 模拟消息数据
const mockMessages = [
  {
    id: '1',
    type: 'drug' as const,
    title: '新型降糖药物XX正式上市',
    content: '经过三期临床试验，新型降糖药物XX已获得国家药监局批准上市。该药物在控制血糖的同时，对心血管具有保护作用，适用于2型糖尿病患者...',
    summary: '新型降糖药物XX获批上市，具有心血管保护作用',
    author: '国家药监局',
    date: '1月15日 09:00',
    timestamp: new Date('2025-01-15T09:00:00').getTime(),
    isPinned: true,
    isRead: false,
    tags: ['新药', '糖尿病', '心血管'],
    stats: { likes: 45, comments: 12, views: 234 }
  },
  {
    id: '2',
    type: 'article' as const,
    title: '2024年高血压诊疗新进展',
    content: '本文综述了2024年国内外高血压诊疗的最新研究进展，包括新型降压药物的临床应用、血压监测技术的发展等...',
    author: '心内科张教授',
    date: '1月14日 14:30',
    timestamp: new Date('2025-01-14T14:30:00').getTime(),
    isPinned: false,
    isRead: true,
    stats: { likes: 32, comments: 8, views: 156 }
  },
  {
    id: '3',
    type: 'announcement' as const,
    title: '平台维护通知',
    content: '为提升服务质量，平台将于1月20日 02:00-06:00进行系统维护，期间部分功能可能无法正常使用...',
    author: '系统管理员',
    date: '1月13日 16:45',
    timestamp: new Date('2025-01-13T16:45:00').getTime(),
    isPinned: false,
    isRead: false,
    stats: { likes: 18, comments: 3, views: 89 }
  },
  {
    id: '4',
    type: 'effect' as const,
    title: '中西医结合治疗慢性胃炎新方案',
    content: '分享一例中西医结合成功治疗慢性胃炎的典型案例，包括中药方剂和西药配合使用方案...',
    author: '消化科李主任',
    date: '1月12日 11:20',
    timestamp: new Date('2025-01-12T11:20:00').getTime(),
    isPinned: false,
    isRead: false,
    stats: { likes: 67, comments: 24, views: 321 }
  },
  {
    id: '5',
    type: 'warning' as const,
    title: '药物相互作用警示：XX药与YY药不宜同时使用',
    content: '近期发现多例XX药与YY药同时使用导致不良反应的案例，请临床医生注意...',
    author: '药品安全监测中心',
    date: '1月11日 15:10',
    timestamp: new Date('2025-01-11T15:10:00').getTime(),
    isPinned: false,
    isRead: false,
    stats: { likes: 29, comments: 15, views: 187 }
  }
];

const MobileMessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [messages] = useState(mockMessages);

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout>
        <div className="p-6 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">请先登录</h3>
          <p className="text-gray-500 mb-4">登录后查看消息中心</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登录
          </button>
        </div>
      </MobileLayout>
    );
  }

  // 筛选消息
  const filteredMessages = selectedType === 'all' 
    ? messages 
    : messages.filter(msg => msg.type === selectedType);

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部标题栏 */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">消息中心</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 消息分类筛选栏 */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* 全部消息 */}
            <button
              className={`flex-shrink-0 px-4 py-2 rounded-full border transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-100 text-blue-600 border-blue-300 font-medium'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedType('all')}
            >
              全部消息
            </button>
            
            {/* 各消息分类 */}
            {Object.entries(MESSAGE_TYPES).map(([type, config]) => (
              <button
                key={type}
                className={`flex-shrink-0 px-4 py-2 rounded-full border flex items-center gap-2 transition-colors ${
                  selectedType === type
                    ? config.color + ' font-medium'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedType(type)}
              >
                <span className="text-base">{config.icon}</span>
                <span className="whitespace-nowrap">{config.label}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                  {config.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 消息列表 */}
        <div className="p-4 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">暂无消息</h3>
              <p className="text-gray-500">当前筛选条件下没有消息</p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const category = MESSAGE_TYPES[message.type];
              
              return (
                <div
                  key={message.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-shadow hover:shadow-md cursor-pointer ${
                    !message.isRead ? 'border-l-4 border-l-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    // 标记为已读
                    console.log('查看消息:', message.id);
                    // 这里可以添加标记已读的逻辑
                    // 跳转到消息详情
                    // navigate(`/mobile/messages/${message.id}`);
                  }}
                >
                  {/* 消息类型和操作 */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded ${category.color}`}>
                        {category.label}
                      </span>
                      {message.isPinned && (
                        <span className="flex items-center gap-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                          <Pin className="w-3 h-3" />
                          置顶
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* 消息标题 */}
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{message.title}</h3>
                  
                  {/* 消息摘要 */}
                  {message.summary && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {message.summary}
                    </p>
                  )}

                  {/* 消息来源和时间 */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span className="font-medium">{message.author}</span>
                    <span className="text-xs">{message.date}</span>
                  </div>

                  {/* 标签 */}
                  {message.tags && message.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {message.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 统计数据 */}
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        {message.stats.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        {message.stats.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-400" />
                        {message.stats.views}
                      </span>
                    </div>
                    {!message.isRead && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded font-medium">
                        未读
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 底部提示 */}
        <div className="p-4 text-center text-gray-400 text-sm">
          <p>向上滑动加载更多消息</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileMessagesPage;
'@

# 4. 保存正确的代码
$correctCode | Out-File -FilePath "C:\Users\dongz\medical-platform\src\pages\mobile\MobileMessagesPage.tsx" -Encoding UTF8
Write-Host "✓ 已创建正确的 MobileMessagesPage.tsx" -ForegroundColor Green
Write-Host "文件大小: $($correctCode.Length) 字节" -ForegroundColor Yellow

# 5. 验证文件格式
Write-Host "`n=== 验证文件前10行 ===" -ForegroundColor Cyan
Get-Content "C:\Users\dongz\medical-platform\src\pages\mobile\MobileMessagesPage.tsx" -TotalCount 10 | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Gray
}