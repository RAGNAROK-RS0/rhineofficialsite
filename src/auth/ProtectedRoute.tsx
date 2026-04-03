import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('ProtectedRoute auth check error');
          if (mounted) navigate('/', { replace: true });
          return;
        }
        if (!data?.user) {
          if (mounted) navigate('/', { replace: true });
          return;
        }
      } catch (err) {
        console.error('Unexpected error during auth check', err);
        if (mounted) navigate('/', { replace: true });
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
    );
  }

  return children;
}
