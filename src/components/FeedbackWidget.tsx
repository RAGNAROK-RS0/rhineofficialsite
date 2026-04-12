import React, { useState } from 'react';
import { Feedback, useFeedback } from '../lib/feedback';

interface FeedbackWidgetProps {
  pageUrl?: string;
}

export default function FeedbackWidget({ pageUrl }: FeedbackWidgetProps) {
  const { submit } = useFeedback();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [type, setType] = useState<Feedback['type']>('improvement');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    submit({ type, rating, comment, pageUrl: pageUrl || window.location.pathname });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
        <p className="text-green-400">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-bold mb-4">Send Feedback</h3>
      
      <div className="mb-4">
        <label className="text-white/60 text-sm block mb-2">How would you rate your experience?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-500' : 'text-white/20 hover:text-yellow-500/50'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-white/60 text-sm block mb-2">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as Feedback['type'])}
          className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="improvement">Improvement</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
          <option value="praise">Praise</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="text-white/60 text-sm block mb-2">Comments (optional)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell us more..."
          rows={3}
          className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="w-full bg-[#0082D8] hover:bg-[#0082D8]/80 disabled:bg-white/10 disabled:text-white/40 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Submit Feedback
      </button>
    </form>
  );
}