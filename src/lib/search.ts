import { useState, useCallback, useMemo } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  highlights?: string[];
  score: number;
}

export interface SearchFilters {
  categories?: string[];
  dateRange?: { start: Date; end: Date };
  tags?: string[];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  filters: SearchFilters;
  isLoading: boolean;
  totalResults: number;
}

const DEMO_RESULTS: SearchResult[] = [
  { id: '1', title: 'Getting Started Guide', description: 'Learn how to set up your account and configure initial settings.', category: 'Documentation', url: '/docs/getting-started', score: 0.95 },
  { id: '2', title: 'API Reference', description: 'Complete reference for all REST API endpoints and GraphQL queries.', category: 'API', url: '/docs/api', score: 0.89 },
  { id: '3', title: 'Authentication Guide', description: 'Secure your application with OAuth 2.0 and API keys.', category: 'Security', url: '/docs/auth', score: 0.85 },
  { id: '4', title: 'Webhooks Integration', description: 'Set up webhooks to receive real-time notifications.', category: 'Integration', url: '/docs/webhooks', score: 0.82 },
  { id: '5', title: 'Pricing Plans', description: 'Compare plans and find the right tier for your needs.', category: 'Billing', url: '/pricing', score: 0.78 },
];

export function useAdvancedSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    filters: {},
    isLoading: false,
    totalResults: 0,
  });

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, query, results: [], totalResults: 0 }));
      return;
    }

    setState(prev => ({ ...prev, query, isLoading: true, filters: filters || {} }));

    await new Promise(resolve => setTimeout(resolve, 300));

    const queryLower = query.toLowerCase();
    const results = DEMO_RESULTS.filter(r => 
      r.title.toLowerCase().includes(queryLower) ||
      r.description.toLowerCase().includes(queryLower) ||
      r.category.toLowerCase().includes(queryLower)
    );

    setState(prev => ({
      ...prev,
      results,
      isLoading: false,
      totalResults: results.length,
    }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  return { ...state, search, setQuery };
}

export function useFacetedSearch(facets: string[]) {
  const [selectedFacets, setSelectedFacets] = useState<Set<string>>(new Set());

  const toggleFacet = useCallback((facet: string) => {
    setSelectedFacets(prev => {
      const next = new Set(prev);
      if (next.has(facet)) {
        next.delete(facet);
      } else {
        next.add(facet);
      }
      return next;
    });
  }, []);

  const clearFacets = useCallback(() => setSelectedFacets(new Set()), []);

  const filterResults = useCallback(<T extends { category: string }>(items: T[]): T[] => {
    if (selectedFacets.size === 0) return items;
    return items.filter(item => selectedFacets.has(item.category));
  }, [selectedFacets]);

  return { selectedFacets, toggleFacet, clearFacets, filterResults };
}