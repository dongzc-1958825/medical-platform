import { useState } from 'react';
import { MedicalCase, Comment } from '../types';

interface Props {
  medicalCases: MedicalCase[];
  onCaseSelect: (medicalCase: MedicalCase) => void;
  onAddComment: (caseId: string, content: string) => void;
}

// 评论组件
const CommentSection = ({ comments, onAddComment }: { comments: Comment[], onAddComment: (content: string) => void }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">评论 ({comments.length})</h4>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="写下您的评论或建议..."
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            发布评论
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                  {comment.author.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900">{comment.author.name}</span>
                <span className="text-gray-500 text-sm">{comment.createdAt}</span>
              </div>
              <button className="text-gray-400 hover:text-red-500">
                ♡ {comment.likes}
              </button>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="pt-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">
                          {reply.author.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{reply.author.name}</span>
                        {reply.targetUser && (
                          <span className="text-gray-500 text-sm">回复 {reply.targetUser}</span>
                        )}
                        <span className="text-gray-500 text-xs">{reply.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function MedicalCasePage({ medicalCases, onCaseSelect, onAddComment }: Props) {
  return (
    <div>
      <div className="space-y-6">
        {medicalCases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* 患者基本信息 */}
            <div className="border-b pb-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">患者信息</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">姓名：</span>
                  <span className="text-gray-900">{caseItem.patientName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">性别：</span>
                  <span className="text-gray-900">{caseItem.patientGender}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">年龄：</span>
                  <span className="text-gray-900">{caseItem.patientAge}岁</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">就诊时间：</span>
                  <span className="text-gray-900">{caseItem.visitTime}</span>
                </div>
                {caseItem.patientIdCard && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">身份证号：</span>
                    <span className="text-gray-900">{caseItem.patientIdCard}</span>
                  </div>
                )}
              </div>
              
              {/* 医疗历史 */}
              {(caseItem.underlyingDiseases || caseItem.drugAllergies) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {caseItem.underlyingDiseases && (
                    <div>
                      <span className="font-medium text-gray-700">基础疾病：</span>
                      <span className="text-gray-900">{caseItem.underlyingDiseases}</span>
                    </div>
                  )}
                  {caseItem.drugAllergies && (
                    <div>
                      <span className="font-medium text-gray-700">药物过敏：</span>
                      <span className="text-gray-900">{caseItem.drugAllergies}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 病例头部信息 */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{caseItem.department}</span>
                {caseItem.isVerified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center">
                    ✓ 已验证
                  </span>
                )}
              </div>
              <span className="text-gray-500 text-sm">{caseItem.createdAt}</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{caseItem.title}</h3>
            
            <div className="mb-4">
              <span className="text-red-600 font-medium">诊断病症：</span>
              <span className="text-gray-700 ml-2">{caseItem.disease}</span>
            </div>
            
            {/* 病历图片 */}
            {caseItem.images.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">病历照片：</h4>
                <div className="flex space-x-2 overflow-x-auto">
                  {caseItem.images.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`病历图片 ${index + 1}`} 
                      className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* 病例详细信息 */}
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong className="text-gray-900">主要症状：</strong>
                <span className="ml-2">{caseItem.symptoms}</span>
              </div>
              <div>
                <strong className="text-gray-900">治疗方案：</strong>
                <span className="ml-2">{caseItem.treatment}</span>
              </div>
              {caseItem.medication && (
                <div>
                  <strong className="text-gray-900">使用药物：</strong>
                  <span className="ml-2">{caseItem.medication}</span>
                </div>
              )}
              {caseItem.doctor && (
                <div>
                  <strong className="text-gray-900">主治医生：</strong>
                  <span className="ml-2">{caseItem.doctor}</span>
                </div>
              )}
              {caseItem.hospital && (
                <div>
                  <strong className="text-gray-900">治疗医院：</strong>
                  <span className="ml-2">{caseItem.hospital}</span>
                </div>
              )}
              {caseItem.outcome && (
                <div>
                  <strong className="text-gray-900">愈后情况：</strong>
                  <span className="ml-2">{caseItem.outcome}</span>
                </div>
              )}
            </div>
            
            {/* 互动区域 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                  <span>❤️</span>
                  <span>{caseItem.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                  <span>⭐</span>
                  <span>{caseItem.collects}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
                  <span>💬</span>
                  <span>{caseItem.comments.length}</span>
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                  {caseItem.author.name.charAt(0)}
                </div>
                <span className="ml-2 text-sm text-gray-600">{caseItem.author.name}</span>
              </div>
            </div>

            {/* 评论区域 */}
            <CommentSection 
              comments={caseItem.comments} 
              onAddComment={(content) => onAddComment(caseItem.id, content)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalCasePage;