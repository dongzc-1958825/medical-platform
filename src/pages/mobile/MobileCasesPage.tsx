import React, { useState, useEffect } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import { Search, Plus, Eye, Heart, Share2, Building, User, Calendar, MapPin, Filter, X } from "lucide-react";

// 模拟数据 - 医案列表（与桌面端相同）
const mockCases = [
  {
    id: 1,
    title: "高血压管理案例",
    patientName: "李女士",
    diagnosis: "原发性高血压",
    symptoms: ["头晕", "心悸", "耳鸣"],
    createdAt: "2025-11-04",
    viewCount: 342,
    likeCount: 28,
    shareCount: 12,
    doctorName: "张医生",
    hospital: "北京协和医院",
    isFeatured: true,
    age: 58,
    gender: "女"
  },
  {
    id: 2,
    title: "糖尿病调理案例",
    patientName: "张先生",
    diagnosis: "2型糖尿病",
    symptoms: ["多饮", "多尿", "体重下降"],
    createdAt: "2025-11-03",
    viewCount: 218,
    likeCount: 15,
    shareCount: 8,
    doctorName: "王医生",
    hospital: "上海瑞金医院",
    isFeatured: true,
    age: 45,
    gender: "男"
  },
  {
    id: 3,
    title: "颈椎病康复案例",
    patientName: "王女士",
    diagnosis: "颈椎病",
    symptoms: ["颈部疼痛", "上肢麻木", "头晕"],
    createdAt: "2025-11-02",
    viewCount: 156,
    likeCount: 9,
    shareCount: 5,
    doctorName: "李医生",
    hospital: "广州中山医院",
    isFeatured: false,
    age: 32,
    gender: "女"
  },
  {
    id: 4,
    title: "中医调理失眠案例",
    patientName: "陈先生",
    diagnosis: "失眠症",
    symptoms: ["入睡困难", "多梦易醒", "白天疲倦"],
    createdAt: "2025-11-01",
    viewCount: 189,
    likeCount: 12,
    shareCount: 6,
    doctorName: "孙医生",
    hospital: "成都中医药大学附属医院",
    isFeatured: true,
    age: 41,
    gender: "男"
  },
  {
    id: 5,
    title: "小儿发热处理案例",
    patientName: "小明",
    age: 4,
    diagnosis: "急性上呼吸道感染",
    symptoms: ["发热", "咳嗽", "流涕"],
    createdAt: "2025-10-30",
    viewCount: 275,
    likeCount: 21,
    shareCount: 11,
    doctorName: "赵医生",
    hospital: "南京儿童医院",
    isFeatured: false,
    gender: "男"
  },
  {
    id: 6,
    title: "产后抑郁调理案例",
    patientName: "刘女士",
    diagnosis: "产后抑郁症",
    symptoms: ["情绪低落", "失眠", "食欲不振"],
    createdAt: "2025-10-28",
    viewCount: 132,
    likeCount: 8,
    shareCount: 4,
    doctorName: "周医生",
    hospital: "武汉同济医院",
    isFeatured: false,
    age: 29,
    gender: "女"
  }
];

// 模拟症状标签（移动端精选）
const symptomTags = [
  "发热", "咳嗽", "头痛", "头晕", "心悸", "腹痛", "失眠", "关节痛"
];

// 模拟疾病分类（移动端精选）
const diseaseCategories = [
  "心血管疾病", "呼吸系统", "消化系统", "神经系统", "内分泌", "骨科", "妇科", "儿科"
];

// 医案卡片组件（移动端优化）
const CaseCard: React.FC<{
  caseData: any;
  onView: () => void;
  onLike: () => void;
  onShare: () => void;
}> = ({ caseData, onView, onLike, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(caseData.likeCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      {/* 精选标签 */}
      {caseData.isFeatured && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
          精选
        </div>
      )}
      
      {/* 卡片头部 */}
      <div className="p-4">
        <div className="flex items-start mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">
              {caseData.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <User className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{caseData.patientName} {caseData.age && `· ${caseData.age}岁`}</span>
            </div>
          </div>
        </div>

        {/* 诊断信息 */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-bold text-sm mb-2">
            {caseData.diagnosis}
          </h4>
          
          {/* 症状标签 */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {caseData.symptoms.map((symptom: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* 医院和时间 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 text-sm truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{caseData.hospital}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span>{caseData.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 卡片底部 - 交互按钮 */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={onView}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            <span className="text-sm">{caseData.viewCount}</span>
          </button>

          <button
            onClick={handleLike}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors px-2 py-1"
          >
            {liked ? (
              <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors px-2 py-1"
          >
            <Share2 className="w-4 h-4 mr-1" />
            <span className="text-sm">{caseData.shareCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 发布新医案表单组件
const NewCaseForm: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    patientName: "",
    diagnosis: "",
    symptoms: [] as string[],
    age: "",
    gender: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSymptomClick = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">发布新医案</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              医案标题 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="例如：高血压管理案例"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                患者姓名
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
                placeholder="可匿名"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年龄
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                placeholder="岁"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主要诊断 *
            </label>
            <input
              type="text"
              required
              value={formData.diagnosis}
              onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              placeholder="例如：原发性高血压"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主要症状
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {symptomTags.map(symptom => (
                <button
                  type="button"
                  key={symptom}
                  onClick={() => handleSymptomClick(symptom)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    formData.symptoms.includes(symptom)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            {formData.symptoms.length > 0 && (
              <p className="text-sm text-gray-600">
                已选: {formData.symptoms.join(", ")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              详细描述
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="请详细描述病情、诊疗过程、治疗效果等..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              发布医案
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MobileCasesPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [cases, setCases] = useState(mockCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "new">("browse");

  // 处理搜索
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 处理症状选择
  const handleSymptomClick = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // 处理类别选择
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  // 清空筛选
  const handleClearFilters = () => {
    setSelectedSymptoms([]);
    setSelectedCategory("");
    setSearchTerm("");
    setShowFilters(false);
  };

  // 发布新医案
  const handleCreateNewCase = (formData: any) => {
    console.log("发布新医案:", formData);
    alert("医案发布成功！（演示功能）");
    setShowNewCaseForm(false);
  };

  // 过滤医案
  useEffect(() => {
    let filtered = [...mockCases];

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.symptoms.some((symptom: string) => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // 按症状过滤
    if (selectedSymptoms.length > 0) {
      filtered = filtered.filter(caseItem =>
        selectedSymptoms.every(symptom =>
          caseItem.symptoms.includes(symptom)
        )
      );
    }

    // 按类别过滤
    if (selectedCategory) {
      filtered = filtered.filter(caseItem =>
        caseItem.diagnosis.includes(selectedCategory) ||
        caseItem.symptoms.some((symptom: string) => 
          symptom.includes(selectedCategory)
        )
      );
    }

    setCases(filtered);
  }, [searchTerm, selectedSymptoms, selectedCategory]);

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
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">请先登录</h3>
        <p className="text-gray-500 mb-4">登录后查看和分享医案</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          前往登录
        </button>
      </div>
    );
  }

  if (showNewCaseForm) {
    return <NewCaseForm onClose={() => setShowNewCaseForm(false)} onSubmit={handleCreateNewCase} />;
  }

  return (
    <div className="pb-24"> {/* 给底部导航和发布按钮留空间 */}
      {/* 顶部标题栏 */}
      <div className="px-4 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              📋
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">医案分享</h1>
              <p className="text-sm text-gray-600">浏览和学习真实医疗案例</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-4 py-3 bg-white border-y">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索医案、疾病、症状..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="bg-white border-b p-4 space-y-4">
          {/* 症状筛选 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">症状筛选</h3>
              {selectedSymptoms.length > 0 && (
                <span className="text-sm text-blue-600">{selectedSymptoms.length}个已选</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {symptomTags.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomClick(symptom)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedSymptoms.includes(symptom)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* 疾病分类 */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">疾病分类</h3>
            <div className="flex flex-wrap gap-2">
              {diseaseCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 筛选操作 */}
          {(selectedSymptoms.length > 0 || selectedCategory || searchTerm) && (
            <div className="pt-4 border-t">
              <button
                onClick={handleClearFilters}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                清空筛选条件
              </button>
            </div>
          )}
        </div>
      )}

      {/* 医案列表 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            医案列表
            {cases.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({cases.length}个)
              </span>
            )}
          </h2>
        </div>
        
        {cases.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">未找到匹配的医案</h3>
            <p className="text-gray-500 mb-4">尝试调整搜索条件</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              清空筛选
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map(caseItem => (
              <CaseCard
                key={caseItem.id}
                caseData={caseItem}
                onView={() => alert(`查看医案详情: ${caseItem.title}`)}
                onLike={() => {}}
                onShare={() => alert(`分享医案: ${caseItem.title}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 发布按钮 - 固定在底部 */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          onClick={() => setShowNewCaseForm(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 底部提示 */}
      {cases.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            共 {cases.length} 个医案 • 数据仅供学习参考
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileCasesPage;
