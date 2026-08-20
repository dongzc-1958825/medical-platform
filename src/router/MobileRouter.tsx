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
      <Route path="/" element={<MobileHomePage />} />
      <Route path="cases" element={<MobileCasesPage />} />
      <Route path="cases/:id" element={<MobileCaseDetailPage />} />
      <Route path="cases/create" element={<CreateCasePage />} />
      <Route path="favorites" element={<MobileFavoritesPage />} />
      <Route path="profile" element={<MobileProfilePage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default MobileRouter;