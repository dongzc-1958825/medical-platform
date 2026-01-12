// src/shared/types/message.ts
// 消息类型定义 - 修复语法错误

export interface MessageComment {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
  replies?: MessageComment[];
}

export interface MessageItem {
  id: string;
  type: 'new_medicine' | 'professional_article' | 'announcement' | 'special_effect' | 'lesson_learned';
  title: string;
  content: string;
  author: string;
  publishTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: string[];
  comments: MessageComment[];
  isPinned?: boolean;
}

export interface MessageCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

// 消息服务类型定义
export interface MessageService {
  getCategories(): MessageCategory[];
  getMessagesByCategory(categoryId: string): MessageItem[];
  getMessageById(id: string): MessageItem | undefined;
  incrementViewCount(id: string): void;
  likeMessage(id: string): void;
  addComment(messageId: string, comment: Omit<MessageComment, 'id'>): MessageComment;
  searchMessages(keyword: string): MessageItem[];
  getHotMessages(limit?: number): MessageItem[];
  getPinnedMessages(): MessageItem[];
}

// 消息查询选项
export interface MessageQueryOptions {
  category?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  keywords?: string[];
  sortBy?: 'publishTime' | 'viewCount' | 'likeCount' | 'commentCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// 消息创建数据
export interface MessageCreateData {
  type: MessageItem['type'];
  title: string;
  content: string;
  author: string;
  tags?: string[];
  isPinned?: boolean;
}

// 消息更新数据
export interface MessageUpdateData {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

// 消息统计
export interface MessageStats {
  totalMessages: number;
  messagesByCategory: Record<string, number>;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageViewsPerMessage: number;
}

// 类型守卫函数
export function isMessageItem(data: any): data is MessageItem {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.type === 'string' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.author === 'string' &&
    typeof data.publishTime === 'string' &&
    typeof data.viewCount === 'number' &&
    typeof data.likeCount === 'number' &&
    typeof data.commentCount === 'number' &&
    Array.isArray(data.comments)
  );
}

export function isMessageComment(data: any): data is MessageComment {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.author === 'string' &&
    typeof data.content === 'string' &&
    typeof data.time === 'string' &&
    typeof data.likes === 'number'
  );
}

export function isMessageCategory(data: any): data is MessageCategory {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.icon === 'string' &&
    typeof data.description === 'string' &&
    typeof data.count === 'number'
  );
}

// 工具函数
export function formatMessageTime(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timeStr;
  }
}

export function getCategoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    'new_medicine': '💊',
    'professional_article': '📚',
    'announcement': '📢',
    'special_effect': '🌟',
    'lesson_learned': '⚠️'
  };
  return icons[categoryId] || '📄';
}

export function getCategoryName(categoryId: string): string {
  const names: Record<string, string> = {
    'new_medicine': '新药信息',
    'professional_article': '专业文章',
    'announcement': '公告发布',
    'special_effect': '特效分享',
    'lesson_learned': '前车之鉴'
  };
  return names[categoryId] || '未知分类';
}

// 默认消息数据（用于测试和初始化）
export const defaultMessageCategories: MessageCategory[] = [
  {
    id: 'new_medicine',
    name: '新药信息',
    icon: '💊',
    description: '最新药品信息和临床应用',
    count: 0
  },
  {
    id: 'professional_article',
    name: '专业文章',
    icon: '📚',
    description: '医学专业文献和研究成果',
    count: 0
  },
  {
    id: 'announcement',
    name: '公告发布',
    icon: '📢',
    description: '平台公告和重要通知',
    count: 0
  },
  {
    id: 'special_effect',
    name: '特效分享',
    icon: '🌟',
    description: '特效治疗方案和经验分享',
    count: 0
  },
  {
    id: 'lesson_learned',
    name: '前车之鉴',
    icon: '⚠️',
    description: '医疗教训和风险警示',
    count: 0
  }
];

// 导出所有类型
export type {
  MessageItem,
  MessageComment,
  MessageCategory,
  MessageService,
  MessageQueryOptions,
  MessageCreateData,
  MessageUpdateData,
  MessageStats
};