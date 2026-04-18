import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreatorDashboard from './pages/CreatorDashboard';
import UploadPhotoPage from './pages/UploadPhotoPage';
import ConsumerGalleryPage from './pages/ConsumerGalleryPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/creator',
    element: (
      <ProtectedRoute allowedRole="creator">
        <CreatorDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/upload',
    element: (
      <ProtectedRoute allowedRole="creator">
        <UploadPhotoPage />
      </ProtectedRoute>
    )
  },
  { path: '/gallery', element: <ConsumerGalleryPage /> },
  { path: '/photo/:id', element: <PhotoDetailPage /> }
];

export default routes;
