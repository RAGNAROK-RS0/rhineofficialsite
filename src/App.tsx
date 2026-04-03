import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthModalProvider } from './auth/AuthModalProvider';

export default function App() {
  return (
    <BrowserRouter>
      <AuthModalProvider themeColor="#4f46e5">
        <AppRoutes />
      </AuthModalProvider>
    </BrowserRouter>
  );
}
