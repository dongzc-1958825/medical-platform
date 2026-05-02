// src/shared/services/caseService.ts
import { MedicalCase, CaseComment, CaseFilter } from '../types/case';
import { supabase } from '../../services/supabaseClient';

class CaseService {
  // 获取所有医案
  async getCases(filter?: CaseFilter): Promise<MedicalCase[]> {
    try {
      let query = supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      let cases = (data || []).map(this.convertToMedicalCase);
      
      // 前端筛选（因为 Supabase 返回的是标准格式）
      if (filter) {
        if (filter.keyword) {
          const keyword = filter.keyword.toLowerCase();
          cases = cases.filter(c => 
            c.title.toLowerCase().includes(keyword) ||
            c.diagnosis.toLowerCase().includes(keyword) ||
            c.description?.toLowerCase().includes(keyword)
          );
        }
        if (filter.tags && filter.tags.length > 0) {
          cases = cases.filter(c => 
            filter.tags!.some(tag => c.tags.includes(tag))
          );
        }
      }
      
      return cases;
    } catch (error) {
      console.error('加载医案失败:', error);
      return [];
    }
  }

  // 获取单个医案
  async getCaseById(id: string): Promise<MedicalCase | null> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? this.convertToMedicalCase(data) : null;
    } catch (error) {
      console.error('获取医案详情失败:', error);
      return null;
    }
  }

  // 创建医案
  async createCase(caseData: Omit<MedicalCase, 'id' | 'createdAt' | 'isFavorite' | 'likeCount' | 'commentCount' | 'views'>): Promise<MedicalCase> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          title: caseData.title,
          content: caseData.description || caseData.diagnosis,
          user_id: this.getCurrentUserId(),
          diagnosis: caseData.diagnosis,
          treatment: caseData.treatment,
          outcome: caseData.outcome,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return this.convertToMedicalCase(data);
    } catch (error) {
      console.error('创建医案失败:', error);
      throw error;
    }
  }

  // 更新医案
  async updateCase(id: string, updates: Partial<MedicalCase>): Promise<MedicalCase | null> {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.content = updates.description;
      if (updates.diagnosis) updateData.diagnosis = updates.diagnosis;
      if (updates.treatment) updateData.treatment = updates.treatment;
      if (updates.outcome) updateData.outcome = updates.outcome;
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data ? this.convertToMedicalCase(data) : null;
    } catch (error) {
      console.error('更新医案失败:', error);
      return null;
    }
  }

  // 删除医案
  async deleteCase(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除医案失败:', error);
      return false;
    }
  }

  // 点赞/取消点赞（后续实现点赞表）
  async toggleLike(id: string): Promise<MedicalCase | null> {
    // TODO: 实现独立的点赞表
    console.log('点赞功能待实现');
    return this.getCaseById(id);
  }

  // 收藏/取消收藏（后续实现收藏表）
  async toggleFavorite(id: string): Promise<MedicalCase | null> {
    // TODO: 实现独立的收藏表
    console.log('收藏功能待实现');
    return this.getCaseById(id);
  }

  // 增加浏览次数
  async incrementViews(id: string): Promise<void> {
    try {
      const case_ = await this.getCaseById(id);
      if (case_) {
        const views = (case_.views || 0) + 1;
        await supabase
          .from('cases')
          .update({ views })
          .eq('id', id);
      }
    } catch (error) {
      console.error('更新浏览量失败:', error);
    }
  }

  // 获取评论（后续实现）
  async getComments(caseId: string): Promise<CaseComment[]> {
    return [];
  }

  // 添加评论（后续实现）
  async addComment(comment: any): Promise<CaseComment> {
    throw new Error('评论功能待实现');
  }

  // 删除评论（后续实现）
  async deleteComment(id: string, caseId: string): Promise<boolean> {
    return false;
  }

  // 私有方法：转换 Supabase 数据格式
  private convertToMedicalCase(data: any): MedicalCase {
    return {
      id: data.id,
      title: data.title,
      patientName: data.user_id?.slice(0, 8) || '匿名',
      description: data.content || '',
      symptoms: [],
      diagnosis: data.diagnosis || '',
      treatment: data.treatment || '',
      outcome: data.outcome || '',
      tags: [],
      imageUrls: [],
      createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      isFavorite: false,
      likeCount: 0,
      commentCount: 0,
      views: 0
    };
  }

  // 私有方法：获取当前用户 ID
  private getCurrentUserId(): string | null {
    // 从 localStorage 获取当前用户
    const userStr = localStorage.getItem('current-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  }
}

export const caseService = new CaseService();