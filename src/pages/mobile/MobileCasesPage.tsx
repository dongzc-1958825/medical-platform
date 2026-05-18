<<<<<<< HEAD
﻿// src/pages/mobile/MobileCasesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Search,
  X,
  User,
  Clock,
  Image,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { supabase } from '../../services/supabaseClient';
import CollectButton from '../../components/collection/CollectButton';
=======
﻿// 第一行
console.log('🔥🔥🔥 正在使用 MobileCasesPage 最新版本 🔥🔥🔥');
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Search, X, User, Clock, Trash2 } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { supabase } from "../../services/supabaseClient";
import CollectButton from "../../components/collection/CollectButton";
>>>>>>> 35456e20860aff740562d54dc01170b0e5b1b83f

interface MedicalCase {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  patientName?: string;
  diagnosis?: string;
  symptoms?: string[];
  description?: string;
  treatment?: string;
  outcome?: string;
  imageUrls?: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFavorite: boolean;
}

const MobileCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "favorites">("all");
  const [showSearch, setShowSearch] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishContent, setPublishContent] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [deletingCaseTitle, setDeletingCaseTitle] = useState("");

<<<<<<< HEAD
  // 从 Supabase 加载医案
  const loadCases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const enhancedCases: MedicalCase[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title || '无标题',
        patientName: item.patient_name || item.author_name || '匿名',
        diagnosis: item.diagnosis || '',
        symptoms: item.symptoms || [],
        createdAt: item.created_at,
        tags: item.tags || [],
        description: item.content || item.description,
        treatment: item.treatment,
        outcome: item.outcome,
        imageUrls: item.image_urls || [],
        isFavorite: false,
        likeCount: item.like_count || 0,
        commentCount: item.comment_count || 0,
        isLiked: false,
        author: item.author_name,
        authorId: item.user_id
      }));
      
      setCases(enhancedCases);
    } catch (error) {
      console.error('加载医案失败:', error);
=======
  // 加载列表
  const loadCases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const enhanced: MedicalCase[] = (data || []).map((c) => ({
        id: c.id,
        title: c.title,
        content: c.content,
        user_id: c.user_id,
        created_at: c.created_at,
        diagnosis: c.content?.substring(0, 50) || "",
        symptoms: [],
        patientName: c.user_id?.slice(0, 8) || "匿名",
        likeCount: 0,
        commentCount: 0,
        isLiked: false,
        isFavorite: false,
      }));
      setCases(enhanced);
    } catch (err) {
      console.error(err);
>>>>>>> 35456e20860aff740562d54dc01170b0e5b1b83f
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // 删除医案
  const handleDeleteCase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // 刷新列表
      await loadCases();
      alert('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
=======
  // 发布（核心：直接写 Supabase，永远不会被摇掉）
  const handlePublish = async () => {
    if (!publishTitle.trim() || !publishContent.trim()) {
      alert("请填写标题和内容");
      return;
    }
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      alert("请先登录");
      return;
    }
    const { error } = await supabase.from("cases").insert({
      title: publishTitle.trim(),
      content: publishContent.trim(),
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
    });
    if (error) {
      alert("发布失败：" + error.message);
    } else {
      alert("✅ 发布成功");
      setPublishTitle("");
      setPublishContent("");
      setShowPublishForm(false);
      loadCases();
>>>>>>> 35456e20860aff740562d54dc01170b0e5b1b83f
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

<<<<<<< HEAD
  const filteredCases = useMemo(() => {
    let result = cases;
    if (selectedFilter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(c => new Date(c.createdAt) >= oneWeekAgo);
    } else if (selectedFilter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.diagnosis.toLowerCase().includes(term) ||
        c.symptoms.some(s => s.toLowerCase().includes(term))
      );
    }
    return result;
  }, [cases, searchTerm, selectedFilter]);

  const handleLike = (id: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        const newLiked = !c.isLiked;
        return {
          ...c,
          isLiked: newLiked,
          likeCount: (c.likeCount || 0) + (newLiked ? 1 : -1)
        };
      }
      return c;
    }));
  };

  const handleDeleteClick = (id: string, title: string) => {
    // 检查权限：作者或管理员可删除
    const caseItem = cases.find(c => c.id === id);
    const isAuthor = user?.id === caseItem?.authorId;
    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      alert('您没有权限删除此医案');
=======
  const handleLike = (id: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isLiked: !c.isLiked, likeCount: c.likeCount + (c.isLiked ? -1 : 1) }
          : c
      )
    );
  };

  const handleDeleteClick = (id: string, title: string) => {
    const isAuthor = user?.id === cases.find((c) => c.id === id)?.user_id;
    const isAdmin = user?.role === "super_admin" || user?.role === "admin";
    if (!isAuthor && !isAdmin) {
      alert("您没有权限删除此医案");
>>>>>>> 35456e20860aff740562d54dc01170b0e5b1b83f
      return;
    }
    setDeletingCaseId(id);
    setDeletingCaseTitle(title);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCaseId) {
<<<<<<< HEAD
      await handleDeleteCase(deletingCaseId);
=======
      await supabase.from("cases").delete().eq("id", deletingCaseId);
      await loadCases();
>>>>>>> 35456e20860aff740562d54dc01170b0e5b1b83f
    }
    setShowDeleteConfirm(false);
    setDeletingCaseId(null);
    setDeletingCaseTitle("");
  };

  const handleFavoriteToggle = (id: string, collected: boolean) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: collected } : c)));
  };

  const filteredCases = useMemo(() => {
    let result = cases;
    if (selectedFilter === "recent") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter((c) => new Date(c.created_at) >= weekAgo);
    } else if (selectedFilter === "favorites") {
      result = result.filter((c) => c.isFavorite);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(term) || c.diagnosis?.toLowerCase().includes(term));
    }
    return result;
  }, [cases, searchTerm, selectedFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "今天";
    if (diff === 1) return "昨天";
    if (diff <= 7) return `${diff}天前`;
    return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold">医案分享</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowSearch(!showSearch)}><Search className="w-5 h-5" /></button>
            <button onClick={() => setShowPublishForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">发布</button>
          </div>
        </div>
        {showSearch && (
          <div className="px-4 pb-3">
            <input
              className="w-full p-2 bg-gray-100 rounded-lg"
              placeholder="搜索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="flex px-4 pb-3 gap-2">
          {["all", "recent", "favorites"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f as any)}
              className={`px-4 py-1 rounded-full ${selectedFilter === f ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              {f === "all" ? "全部" : f === "recent" ? "最近一周" : "我的收藏"}
            </button>
          ))}
        </div>
        <div className="px-4 pb-2 text-sm text-gray-500">共 {filteredCases.length} 个医案</div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-b-2 border-blue-600 rounded-full" /></div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无医案</div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border p-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/mobile/cases/${item.id}`)}>{item.title}</h3>
                  <button onClick={() => handleDeleteClick(item.id, item.title)}><Trash2 className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                  <User className="w-3 h-3" /><span>{item.patientName}</span>
                  <Clock className="w-3 h-3" /><span>{formatDate(item.created_at)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-700 line-clamp-3">{item.content}</div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t">
                  <button onClick={() => handleLike(item.id)} className="flex items-center gap-1">
                    <Heart className={`w-4 h-4 ${item.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    <span>{item.likeCount}</span>
                  </button>
                  <CollectButton
                    itemId={item.id}
                    itemType="case"
                    itemData={{ title: item.title, date: item.created_at }}
                    initialCollected={item.isFavorite}
                    onToggle={(collected) => handleFavoriteToggle(item.id, collected)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPublishForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">发布新医案</h2>
            <input className="w-full border p-2 rounded mb-3" placeholder="标题" value={publishTitle} onChange={(e) => setPublishTitle(e.target.value)} />
            <textarea className="w-full border p-2 rounded mb-3" rows={4} placeholder="内容" value={publishContent} onChange={(e) => setPublishContent(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPublishForm(false)} className="px-4 py-2 bg-gray-200 rounded">取消</button>
              <button onClick={handlePublish} className="px-4 py-2 bg-blue-600 text-white rounded">确认发布</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <p>确定删除「{deletingCaseTitle}」吗？</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 bg-gray-200 rounded">取消</button>
              <button onClick={handleConfirmDelete} className="px-3 py-1 bg-red-600 text-white rounded">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCasesPage;