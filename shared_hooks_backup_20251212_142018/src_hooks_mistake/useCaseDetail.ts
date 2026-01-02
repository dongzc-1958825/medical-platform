import { useState, useCallback, useEffect } from 'react';
import { MedicalCase } from '../../types/medical';
import { caseApi } from '../shared/api/caseApi';

export function useCaseDetail(caseId: string) {
  const [caseDetail, setCaseDetail] = useState<MedicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCaseDetail = useCallback(async () => {
    if (!caseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await caseApi.getCaseDetail(caseId);
      setCaseDetail(data);
    } catch (err) {
      setError('加载医案详情失败');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadCaseDetail();
  }, [caseId]);

  return {
    caseDetail,
    loading,
    error,
    refresh: loadCaseDetail,
  };
}
