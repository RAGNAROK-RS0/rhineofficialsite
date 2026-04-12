import { useState, useEffect, useCallback } from 'react';

interface SearchSuggestion {
  text: string;
  category: 'page' | 'action' | 'recent';
  icon?: string;
}

export function useAISearchSuggestions(query: string): SearchSuggestion[] {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    const lower = searchQuery.toLowerCase();
    const results: SearchSuggestion[] = [];

    const pageSuggestions = [
      { text: 'Services', category: 'page' as const, keywords: ['service', 'development', 'cloud'] },
      { text: 'Portfolio', category: 'page' as const, keywords: ['project', 'work', 'showcase'] },
      { text: 'Pricing', category: 'page' as const, keywords: ['price', 'cost', 'plan', 'pricing'] },
      { text: 'Contact', category: 'page' as const, keywords: ['contact', 'email', 'reach'] },
      { text: 'About', category: 'page' as const, keywords: ['about', 'company', 'team'] },
      { text: 'Technology', category: 'page' as const, keywords: ['tech', 'webgpu', '3d'] },
      { text: 'Solutions', category: 'page' as const, keywords: ['solution', 'enterprise'] },
      { text: 'Dashboard', category: 'page' as const, keywords: ['dashboard', 'admin'] },
    ];

    pageSuggestions.forEach((page) => {
      if (page.keywords.some((kw) => kw.includes(lower) || lower.includes(kw)) || 
          page.text.toLowerCase().includes(lower)) {
        results.push({ text: page.text, category: 'page' });
      }
    });

    if (lower.includes('build') || lower.includes('start')) {
      results.push({ text: 'Start a Project', category: 'action', icon: 'rocket' });
    }

    if (lower.includes('help') || lower.includes('ai') || lower.includes('chat')) {
      results.push({ text: 'Talk to AI Assistant', category: 'action', icon: 'bot' });
    }

    return results.slice(0, 5);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuggestions(generateSuggestions(query));
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [query, generateSuggestions]);

  return suggestions;
}

export function useContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(async (type: 'summary' | 'description', input: string): Promise<string> => {
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    let result = '';
    
    if (type === 'summary') {
      const words = input.split(' ').slice(0, 20).join(' ');
      result = `This page covers ${words}... (auto-generated summary)`;
    } else {
      result = `Professional description for: ${input}. Our team delivers exceptional results with cutting-edge technology.`;
    }

    setIsGenerating(false);
    return result;
  }, []);

  return { generateContent, isGenerating };
}

export function useSmartSearch() {
  const [query, setQuery] = useState('');
  const suggestions = useAISearchSuggestions(query);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  return { query, setQuery: search, suggestions };
}