// src/router/MobileRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHomePage from '../pages/mobile/MobileHomePage';
import MobileCasesPage from '../pages/mobile/MobileCasesPage';
import MobileCaseDetailPage from '../pages/mobile/MobileCaseDetailPage';
import MobileFavoritesPage from '../pages/mobile/MobileFavoritesPage';
import MobileProfilePage from '../pages/mobile/MobileProfilePage';
import CreateCasePage from '../pages/CreateCasePage/index';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const MobileRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="mobile" element={<MobileHomePage />} />
      <Route path="mobile/cases" element={<MobileCasesPage />} />
      <Route path="mobile/cases/:id" element={<MobileCaseDetailPage />} />
      <Route path="mobile/cases/create" element={<CreateCasePage />} />
      <Route path="mobile/favorites" element={<MobileFavoritesPage />} />
      <Route path="mobile/profile" element={<MobileProfilePage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default MobileRouter;