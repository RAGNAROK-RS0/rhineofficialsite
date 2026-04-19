import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (mounted) setDisplayName(data.user?.user_metadata?.full_name ?? '');
      } catch (err: any) {
        console.error('Failed to load user metadata', err.message || err);
      }
    })();
    return () => { mounted = false; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateDisplayName = (n: string) => {
    if (n.length > 50) return 'Display name too long';
    if (!/^[-0-9A-Za-z _.'@*!:]+$/.test(n)) return 'Invalid characters in name';
    return null;
  };

  const handleSave = async () => {
    setError(null);
    const v = validateDisplayName(displayName.trim());
    if (v) return setError(v);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: displayName.trim() }
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      console.error('Failed to update profile', err.message || err);
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white/6 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button onClick={onClose} className="text-white/60">Close</button>
        </div>

        {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

        <label className="block text-xs text-white/60 mb-2">Display name</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-3 py-2 bg-white/5 rounded" />

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/5 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-white/10 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
