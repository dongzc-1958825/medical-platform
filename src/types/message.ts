// src/types/message.ts
// 独立的消息类型定义 - 不依赖共享类型

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
