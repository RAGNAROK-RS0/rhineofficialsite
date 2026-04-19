import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { useAdvancedSearch, useFacetedSearch, SearchResult } from '../../lib/search';

function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <a href={result.url} className="block bg-black/60 border border-white/10 rounded-lg p-4 hover:border-[#0082D8]/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-medium">{result.title}</h4>
        <span className="text-[#0082D8] text-xs px-2 py-0.5 bg-[#0082D8]/10 rounded">{result.category}</span>
      </div>
      <p className="text-white/60 text-sm mb-2">{result.description}</p>
      <div className="text-white/40 text-xs">Relevance: {Math.round(result.score * 100)}%</div>
    </a>
  );
}

export default function AdvancedSearchPage() {
  const { themeColor } = useThemeHue();
  const { query, results, isLoading, totalResults, search, setQuery } = useAdvancedSearch();
  const { selectedFacets, toggleFacet, clearFacets } = useFacetedSearch(['Documentation', 'API', 'Security', 'Integration', 'Billing']);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = ['Documentation', 'API', 'Security', 'Integration', 'Billing'];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/technology" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Technology
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Technology</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Advanced Search</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Algolia-powered instant search with faceted filtering and relevance tuning.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-8">
              <aside className="w-64 shrink-0">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">Filters</h3>
                    {selectedFacets.size > 0 && (
                      <button onClick={clearFacets} className="text-white/40 text-sm hover:text-white">Clear</button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFacets.has(cat)}
                          onChange={() => toggleFacet(cat)}
                          className="w-4 h-4 rounded border-white/20 bg-black/60 text-[#0082D8] focus:ring-[#0082D8]"
                        />
                        <span className="text-white/80 text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={e => { setQuery(e.target.value); search(e.target.value); }}
                      placeholder="Search documentation, API, guides..."
                      className="w-full bg-black/80 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-white/40 focus:outline-none focus:border-[#0082D8]"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {isLoading && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-[#0082D8] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {query && (
                  <div className="mb-4 text-white/60 text-sm">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                  </div>
                )}

                <div className="space-y-4">
                  {results.length === 0 && query && !isLoading && (
                    <div className="text-center py-12 text-white/40">No results found. Try different keywords.</div>
                  )}
                  {results.map(result => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Search Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-bold mb-2">Instant Search</h3>
                  <p className="text-white/60 text-sm">Results appear as you type with sub-50ms response times.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Faceted Filtering</h3>
                  <p className="text-white/60 text-sm">Filter by category, date, tags, and custom attributes.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Typo Tolerance</h3>
                  <p className="text-white/60 text-sm">Smart matching handles spelling mistakes automatically.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Analytics</h3>
                  <p className="text-white/60 text-sm">Track search queries and optimize for popular terms.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}