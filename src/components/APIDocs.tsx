import { useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  category: string;
}

const endpoints: APIEndpoint[] = [
  { path: '/api/v1/auth/login', method: 'POST', description: 'Authenticate user and get token', category: 'Auth' },
  { path: '/api/v1/auth/register', method: 'POST', description: 'Register new user account', category: 'Auth' },
  { path: '/api/v1/users/me', method: 'GET', description: 'Get current user profile', category: 'Users' },
  { path: '/api/v1/users', method: 'GET', description: 'List all users (admin)', category: 'Users' },
  { path: '/api/v1/projects', method: 'GET', description: 'List user projects', category: 'Projects' },
  { path: '/api/v1/projects', method: 'POST', description: 'Create new project', category: 'Projects' },
  { path: '/api/v1/analytics', method: 'GET', description: 'Get analytics data', category: 'Analytics' },
  { path: '/api/v1/teams', method: 'GET', description: 'List team members', category: 'Teams' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-yellow-500/20 text-yellow-400',
  DELETE: 'bg-red-500/20 text-red-400',
};

export default function APIDocs() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['all', ...new Set(endpoints.map(e => e.category))];
  
  const filtered = activeCategory === 'all' 
    ? endpoints 
    : endpoints.filter(e => e.category === activeCategory);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Endpoints
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs capitalize ${
                  activeCategory === cat 
                    ? 'bg-[#0082D8] text-white' 
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((endpoint, i) => (
              <button
                key={i}
                onClick={() => setSelectedEndpoint(endpoint)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedEndpoint?.path === endpoint.path
                    ? 'bg-[#0082D8]/20 border border-[#0082D8]/30'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${methodColors[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <span className="text-white/60 text-xs">{endpoint.category}</span>
                </div>
                <div className="text-white text-sm truncate">{endpoint.path}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedEndpoint ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${methodColors[selectedEndpoint.method]}`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-white text-lg font-mono">{selectedEndpoint.path}</span>
                <button
                  onClick={() => copyToClipboard(selectedEndpoint.path)}
                  className="p-1.5 rounded hover:bg-white/10 text-white/40"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/60">{selectedEndpoint.description}</p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Request Example</h4>
              <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
{`curl -X ${selectedEndpoint.method} https://api.rhinesolution.com${selectedEndpoint.path} \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Response Example</h4>
              <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
{`{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2026-04-12T10:30:00Z"
  }
}`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/40">Select an endpoint to view documentation</p>
          </div>
        )}
      </div>
    </div>
  );
}