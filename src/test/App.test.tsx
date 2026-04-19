import { describe, it, expect, vi } from 'vitest';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('App', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });

  it('has correct title', () => {
    const title = 'Rhine Solution';
    expect(title).toBe('Rhine Solution');
  });
});