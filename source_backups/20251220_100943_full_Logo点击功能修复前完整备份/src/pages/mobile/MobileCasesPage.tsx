import React from "react";
import { useMedicalCases } from "../../shared/hooks/useMedicalCases";
import MobileLayout from "../../components/layout/MobileLayout";

// 简单的日期格式化函数
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  } catch (e) {
    return "未知日期";
  }
};

const MobileCasesPage = () => {
  const { cases, loading, error } = useMedicalCases();

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">加载失败</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">医案列表</h1>
        
        {cases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无医案数据
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-4 rounded-lg shadow border hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {/* 使用 summary 或 content 的前N个字符作为描述 */}
                  {item.summary || item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '') || "暂无描述"}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>作者: {item.authorName || "匿名"}</span>
                  <span>{item.createdAt ? formatDate(item.createdAt) : "未知日期"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MobileCasesPage;