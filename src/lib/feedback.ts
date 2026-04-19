import { useState, useCallback } from 'react';

export interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'praise';
  rating: number;
  comment: string;
  pageUrl?: string;
  timestamp: Date;
  userId?: string;
  status: 'pending' | 'reviewed' | 'implemented';
}

export interface UserJourney {
  id: string;
  userId: string;
  steps: JourneyStep[];
  startedAt: Date;
  completedAt?: Date;
}

export interface JourneyStep {
  page: string;
  action: string;
  timestamp: Date;
  duration: number;
}

export class FeedbackService {
  private feedback: Feedback[] = [];
  private journeys: UserJourney[] = [];

  submitFeedback(feedback: Omit<Feedback, 'id' | 'timestamp' | 'status'>): Feedback {
    const newFeedback: Feedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'pending',
    };
    this.feedback.unshift(newFeedback);
    return newFeedback;
  }

  getFeedback(filter?: Partial<Feedback>): Feedback[] {
    if (!filter) return [...this.feedback];
    return this.feedback.filter(f => 
      Object.entries(filter).every(([k, v]) => f[k as keyof Feedback] === v)
    );
  }

  updateStatus(id: string, status: Feedback['status']): void {
    const feedback = this.feedback.find(f => f.id === id);
    if (feedback) feedback.status = status;
  }

  trackJourney(userId: string, step: Omit<JourneyStep, 'timestamp'>): void {
    let journey = this.journeys.find(j => j.userId === userId && !j.completedAt);
    if (!journey) {
      journey = { id: crypto.randomUUID(), userId, steps: [], startedAt: new Date() };
      this.journeys.push(journey);
    }
    journey.steps.push({ ...step, timestamp: new Date() });
  }

  completeJourney(userId: string): void {
    const journey = this.journeys.find(j => j.userId === userId && !j.completedAt);
    if (journey) journey.completedAt = new Date();
  }

  getJourneys(userId?: string): UserJourney[] {
    if (userId) return this.journeys.filter(j => j.userId === userId);
    return [...this.journeys];
  }

  getAnalytics() {
    const total = this.feedback.length;
    const byType = this.feedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgRating = this.feedback.reduce((sum, f) => sum + f.rating, 0) / (total || 1);
    return { total, byType, avgRating: avgRating.toFixed(1) };
  }
}

export const feedbackService = new FeedbackService();

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const submit = useCallback((data: Omit<Feedback, 'id' | 'timestamp' | 'status'>) => {
    const newFeedback = feedbackService.submitFeedback(data);
    setFeedback(prev => [newFeedback, ...prev]);
    return newFeedback;
  }, []);

  const getAll = useCallback(() => {
    const all = feedbackService.getFeedback();
    setFeedback(all);
    return all;
  }, []);

  const getAnalytics = useCallback(() => feedbackService.getAnalytics(), []);

  return { feedback, submit, getAll, getAnalytics };
}

export function useUserJourney(userId: string) {
  const trackStep = useCallback((action: string, page: string, duration: number) => {
    feedbackService.trackJourney(userId, { action, page, duration });
  }, [userId]);

  const complete = useCallback(() => {
    feedbackService.completeJourney(userId);
  }, [userId]);

  return { trackStep, complete };
}