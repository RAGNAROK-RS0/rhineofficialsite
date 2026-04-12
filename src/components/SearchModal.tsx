import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, ArrowRight, Command, CornerDownLeft } from 'lucide-react';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
  keywords?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchIndex: SearchResult[] = [
  { title: 'Home', description: 'Welcome to Rhine Solution - Innovative technology solutions', path: '/', category: 'Pages', keywords: ['landing', 'welcome', 'hero'] },
  { title: 'About', description: 'Learn about our company, mission, and team', path: '/about', category: 'Pages', keywords: ['company', 'team', 'mission'] },
  { title: 'Services', description: 'Explore our technology services and solutions', path: '/services', category: 'Pages', keywords: ['offerings', 'consulting'] },
  { title: 'Solutions', description: 'Industry-specific technology solutions', path: '/solutions', category: 'Pages', keywords: ['products', 'industries'] },
  { title: 'Technology', description: 'Cutting-edge technology platforms and capabilities', path: '/technology', category: 'Pages', keywords: ['tech', 'platforms', 'innovation'] },
  { title: 'Resources', description: 'Case studies, blog insights, and documentation', path: '/resources', category: 'Pages', keywords: ['blog', 'articles', 'docs'] },
  { title: 'Contact', description: 'Get in touch with our team', path: '/contact', category: 'Pages', keywords: ['reach', 'support', 'help'] },
  { title: 'Portfolio', description: 'View our recent projects and case studies', path: '/portfolio', category: 'Pages', keywords: ['projects', 'work', 'showcase'] },
  { title: 'Dashboard', description: 'User dashboard with projects and settings', path: '/dashboard', category: 'Pages', keywords: ['account', 'profile', 'settings'] },
  { title: 'Web Development', description: 'Full-stack web development services', path: '/services/web-development', category: 'Services', keywords: ['frontend', 'backend', 'react', 'node'] },
  { title: 'Cloud Infrastructure', description: 'Cloud architecture and DevOps services', path: '/services/cloud-infrastructure', category: 'Services', keywords: ['aws', 'azure', 'gcp', 'devops'] },
  { title: 'IT Consulting', description: 'Strategic IT consulting and advisory', path: '/services/it-consulting', category: 'Services', keywords: ['strategy', 'advisory'] },
  { title: 'Digital Transformation', description: 'Transform your business with digital solutions', path: '/services/digital-transformation', category: 'Services', keywords: [' modernization', 'automation'] },
  { title: 'Enterprise Software', description: 'Custom enterprise software solutions', path: '/solutions/enterprise-software', category: 'Solutions', keywords: ['business', 'corporate', 'saas'] },
  { title: 'AI & Automation', description: 'AI-powered automation solutions', path: '/solutions/ai-automation', category: 'Solutions', keywords: ['machine learning', 'ml', 'automation', 'bot'] },
  { title: 'Cybersecurity', description: 'Comprehensive security solutions', path: '/solutions/cybersecurity-suite', category: 'Solutions', keywords: ['security', 'protection', 'privacy'] },
  { title: 'Data Analytics', description: 'Business intelligence and analytics', path: '/solutions/data-analytics', category: 'Solutions', keywords: ['bi', 'insights', 'visualization'] },
  { title: 'WebGPU 3D', description: 'Next-gen 3D graphics and visualization', path: '/technology/webgpu-3d', category: 'Technology', keywords: ['3d', 'graphics', 'webgl'] },
  { title: 'Blockchain & Web3', description: 'Blockchain development and Web3 solutions', path: '/technology/blockchain-web3', category: 'Technology', keywords: ['crypto', 'nft', 'defi'] },
  { title: 'IoT & Edge', description: 'Internet of Things and edge computing', path: '/technology/iot-edge', category: 'Technology', keywords: ['sensors', 'embedded'] },
  { title: 'Custom APIs', description: 'API development and integration', path: '/technology/custom-apis', category: 'Technology', keywords: ['rest', 'graphql', 'integration'] },
  { title: 'Blog Insights', description: 'Latest technology articles and insights', path: '/resources/blog-insights', category: 'Resources', keywords: ['articles', 'news'] },
  { title: 'Case Studies', description: 'Success stories and project showcases', path: '/resources/case-studies', category: 'Resources', keywords: ['success', 'projects'] },
  { title: 'Documentation', description: 'Technical documentation and guides', path: '/resources/documentation', category: 'Resources', keywords: ['docs', 'guides', 'tutorials'] },
];

const fuse = new Fuse(searchIndex, {
  keys: ['title', 'description', 'keywords', 'category'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
});

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    return fuse.search(query).slice(0, 10).map(r => r.item);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].path);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, services, docs..."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-lg"
          />
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-white/50">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.path}
                  onClick={() => {
                    navigate(result.path);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-left ${
                    index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{result.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary">{result.category}</span>
                    </div>
                    <p className="text-sm text-white/50 truncate">{result.description}</p>
                  </div>
                  {index === selectedIndex && (
                    <CornerDownLeft className="w-4 h-4 text-white/40" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 border-t border-white/10 text-xs text-white/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> Select</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white/70 transition-colors"
    >
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 rounded text-xs text-white/40">
        <Command className="w-2.5 h-2.5" />K
      </kbd>
    </button>
  );
}