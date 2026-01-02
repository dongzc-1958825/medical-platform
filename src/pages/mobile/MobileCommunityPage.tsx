import React, { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";

// 按汉语拼音排序的专病名录（与桌面端相同）
const diseaseCommunities = [
  { id: "asthma", name: "哮喘", pinyin: "xiaochuan", members: 2845, online: 123 },
  { id: "diabetes", name: "糖尿病", pinyin: "tangniaobing", members: 3921, online: 256 },
  { id: "hypertension", name: "高血压", pinyin: "gaoxueya", members: 5678, online: 389 },
  { id: "coronary", name: "冠心病", pinyin: "guanxinbing", members: 2341, online: 167 },
  { id: "arthritis", name: "关节炎", pinyin: "guanjieyan", members: 1890, online: 98 },
  { id: "headache", name: "偏头痛", pinyin: "piantoutong", members: 1456, online: 87 },
  { id: "depression", name: "抑郁症", pinyin: "yiyuzheng", members: 3210, online: 234 },
  { id: "insomnia", name: "失眠症", pinyin: "shimianzheng", members: 2789, online: 189 },
  { id: "allergy", name: "过敏性疾病", pinyin: "guominxingjibing", members: 1987, online: 134 },
  { id: "copd", name: "慢阻肺", pinyin: "manzufei", members: 1234, online: 76 },
  { id: "ibd", name: "炎症性肠病", pinyin: "yanzhengxingchangbing", members: 876, online: 45 },
  { id: "psoriasis", name: "银屑病", pinyin: "yinxiebing", members: 1543, online: 92 },
  { id: "thyroid", name: "甲状腺疾病", pinyin: "jiazhuangxianjibing", members: 2678, online: 178 },
  { id: "osteoporosis", name: "骨质疏松", pinyin: "guzhishusong", members: 1892, online: 112 },
  { id: "migraine", name: "偏头痛", pinyin: "piantoutong", members: 1678, online: 101 },
  { id: "anxiety", name: "焦虑症", pinyin: "jiaolvzheng", members: 2987, online: 213 },
  { id: "asthma_copd", name: "哮喘-慢阻肺重叠", pinyin: "xiaochuanmanzufeichongdie", members: 765, online: 34 },
  { id: "gerd", name: "胃食管反流", pinyin: "weishiguanfanliu", members: 2345, online: 156 },
  { id: "ibh", name: "心律失常", pinyin: "xinlvshichang", members: 1876, online: 123 },
  { id: "dementia", name: "认知障碍", pinyin: "renzhizhangai", members: 1432, online: 89 }
].sort((a, b) => a.pinyin.localeCompare(b.pinyin));

// 模拟聊天消息
const mockMessages = {
  asthma: [
    { id: 1, user: "张医生", content: "大家好，我是呼吸科张医生，今天我们来聊聊哮喘的日常管理", time: "10:00", isDoctor: true },
    { id: 2, user: "李女士", content: "张医生好！我孩子最近哮喘发作比较频繁，有什么预防措施吗？", time: "10:02", isDoctor: false },
    { id: 3, user: "王先生", content: "我用的吸入剂感觉效果不如以前了，需要调整吗？", time: "10:03", isDoctor: false },
    { id: 4, user: "张医生", content: "李女士，建议记录发作的诱因，比如天气变化、过敏原等。王先生，建议复诊评估用药方案", time: "10:05", isDoctor: true }
  ],
  diabetes: [
    { id: 1, user: "刘医生", content: "欢迎糖友们！今天我们来讨论血糖监测的重要性", time: "09:30", isDoctor: true },
    { id: 2, user: "陈阿姨", content: "我空腹血糖总是偏高，怎么办？", time: "09:32", isDoctor: false },
    { id: 3, user: "赵先生", content: "大家用的什么牌子的血糖仪？求推荐", time: "09:35", isDoctor: false }
  ]
};

const MobileCommunityPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // 过滤疾病列表
  const filteredDiseases = diseaseCommunities.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.pinyin.includes(searchTerm.toLowerCase())
  );

  // 获取当前选中的疾病信息
  const currentDisease = selectedDisease ? 
    diseaseCommunities.find(d => d.id === selectedDisease) : null;

  // 获取当前疾病的聊天消息
  const currentMessages = selectedDisease ? 
    (mockMessages as any)[selectedDisease] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDisease || !user) return;
    // 这里可以添加发送消息的逻辑
    console.log("发送消息:", newMessage);
    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">请先登录</h3>
        <p className="text-gray-500 mb-4">登录后参与专病社区讨论</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          前往登录
        </button>
      </div>
    );
  }

  if (selectedDisease && currentDisease) {
    // 移动端聊天界面
    return (
      <div className="pb-20">
        {/* 群聊头部 */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedDisease(null)}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{currentDisease.name}病友群</h1>
                <p className="text-xs text-gray-500">
                  {currentDisease.online}人在线
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                🔍
              </button>
            </div>
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="p-3 space-y-3 pb-16">
          {currentMessages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.isDoctor ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isDoctor
                    ? "bg-white border border-gray-200"
                    : "bg-blue-500 text-white"
                }`}
              >
                {message.isDoctor && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">
                      🩺
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.user}</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isDoctor ? "text-gray-500" : "text-blue-200"
                }`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* 空状态提示 */}
          {currentMessages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>暂无聊天记录</p>
              <p className="text-sm mt-1">快来发送第一条消息吧！</p>
            </div>
          )}
        </div>

        {/* 输入框 - 固定在底部 */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              😊
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="输入消息..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 主页面 - 专病名录（移动端优化）
  return (
    <div className="pb-20">
      {/* 页面标题 */}
      <div className="px-4 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              👥
            </div>
            <h1 className="text-xl font-bold text-gray-900">专病社区</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            🔍
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-1 ml-13">选择疾病类型，加入病友交流群</p>
      </div>

      {/* 搜索框 */}
      <div className="bg-white px-4 py-3 border-y">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="搜索疾病名称或拼音..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 专病名录列表 */}
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">专病名录</h2>
          <p className="text-sm text-gray-600">按拼音排序，点击进入病友群</p>
        </div>

        <div className="space-y-2">
          {filteredDiseases.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-600">未找到相关疾病</p>
              <p className="text-sm text-gray-500 mt-1">尝试搜索其他疾病名称</p>
            </div>
          ) : (
            filteredDiseases.map((disease) => (
              <button
                key={disease.id}
                onClick={() => setSelectedDisease(disease.id)}
                className="w-full bg-white rounded-xl p-4 hover:bg-gray-50 transition-colors text-left shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      🩺
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{disease.name}</h3>
                      <p className="text-xs text-gray-500">{disease.pinyin}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{disease.members.toLocaleString()}人</div>
                    <div className="text-xs text-green-600">{disease.online}在线</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* 使用说明 */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">如何使用专病社区？</h3>
          <ul className="text-blue-700 space-y-1 text-xs">
            <li>• 搜索疾病名称或拼音快速查找</li>
            <li>• 点击疾病名称进入病友交流群</li>
            <li>• 在群内交流经验，获取医生建议</li>
            <li>• 所有交流内容严格保密</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileCommunityPage;
