import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = searchParams.get('type');

    if (type === 'recovery' || accessToken) {
      setTokenValid(true);
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Validating...</div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-bold text-white">Invalid Link</h1>
          </div>
          <p className="text-white/60 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-brand-primary" />
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>

        <p className="text-white/60 mb-6">
          Enter your new password below. Make sure it's at least 8 characters.
        </p>

        {message && (
          <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/80 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Remember your password?{' '}
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}