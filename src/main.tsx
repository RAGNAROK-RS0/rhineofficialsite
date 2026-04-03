import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
const ThreeRoot = lazy(() => import('./components/threeroot'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Suspense fallback={null}>
      <ThreeRoot />
    </Suspense>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </>
);
