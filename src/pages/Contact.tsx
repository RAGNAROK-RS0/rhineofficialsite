import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Turnstile } from '@marsidev/react-turnstile';

// Vite env: VITE_TURNSTILE_SITEKEY should be set in .env
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY || '';
import { Helmet } from 'react-helmet-async';

type FormState = {
  name: string;
  email: string;
  message: string;
};

// Client-side validation utilities
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof FormState, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !isEmail(form.email) || form.message.trim().length < 10) {
      setError('Please provide a valid name, email, and a message of at least 10 characters.');
      return;
    }
    if (!token) {
      setError('Please complete the captcha.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to send message');
      }

      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setToken(null);
    } catch (err: any) {
      setError(err?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout themeColor="#4f46e5" showAuthButtons>
      <Helmet>
        <title>Contact | Rhine Solution</title>
        <meta name="description" content="Contact Rhine Solution for WebGPU, cloud infrastructure and custom web platforms." />
      </Helmet>

      <div className="py-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-10">
          <h1 className="text-4xl font-black mb-6">Contact Us</h1>

          {success && <div className="mb-4 p-3 bg-green-500/10 text-green-300 rounded">Message sent!</div>}
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-300 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              className="w-full p-3 bg-white/5 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              className="w-full p-3 bg-white/5 rounded"
            />

            <textarea
              placeholder="Message"
              rows={6}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              required
              className="w-full p-3 bg-white/5 rounded"
            />

            <div className="pt-2">
              <Turnstile siteKey={TURNSTILE_SITEKEY} onSuccess={(t) => setToken(t)} />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white/10 rounded hover:bg-white/20 transition-all"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
