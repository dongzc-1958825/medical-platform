【医案平台项目上下文】

=== 项目状态（2025年11月6日）===
【已完成】
✓ 用户登录系统
✓ 欢迎页面和路由框架  
✓ 寻医问药完整功能（咨询发布、回复、专病社区）

【当前问题】
! 寻医问药导航点击无反应（待修复）

【待开发】
○ 管理员功能
○ 消息中心优化
○ 数据统计

=== 技术栈 ===
前端：React 18 + TypeScript + Vite
样式：Tailwind CSS
路由：React Router DOM
状态：useState/useEffect

=== 核心文件 ===
src/types/consultation.ts - 咨询数据类型
src/services/consultationService.ts - 咨询业务逻辑  
src/pages/HelpPage.tsx - 寻医问药主页面
src/components/MainLayout.tsx - 主布局导航
src/App.tsx - 应用入口和路由

=== 重要功能 ===
【寻医问药】（最新完成）
- 咨询功能：发布咨询、回复互动、状态管理
- 专病社区：疾病分类、社区聊天
- 数据持久化：localStorage存储

【用户系统】
- 登录/注销状态管理
- 路由守卫保护

=== 下一步计划 ===
1. 修复寻医问药导航问题（最高优先级）
2. 完善医案分享功能
3. 开发管理员功能

=== 开发备注 ===
* 使用TypeScript严格模式
* 组件采用函数式 + Hooks  
* 样式使用Tailwind CSS
* 新功能先在对应页面内开发

---
最后更新：2025年11月6日
## 📋 变更日志

### 2025-11-12 v2.0 - 移动端开发启动
- 添加移动端路由架构 (/mobile/*)
- 创建移动端布局组件和CSS优化
- 分离CasePublishForm和CaseForm组件
- 更新技术栈和项目结构文档

### 2025-11-11 v1.0 - 基础架构完成  
- 完成桌面版核心功能
- 解决创建医案模态框问题
- 建立模块化代码结构