import { MedicalPost, MessageCategory, MedicalDataUtils } from '@/shared/types/message';

console.log('✅ 导入测试通过');
console.log('分类:', MedicalDataUtils.getCategoryDisplayName('new-drug'));
console.log('角色:', MedicalDataUtils.getRoleDisplayName('doctor'));

const testData = MedicalDataUtils.createDefaultPost({
  id: 'test-user',
  name: '测试医生',
  role: 'doctor'
});
console.log('默认帖子:', testData.entityType);
