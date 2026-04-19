import { useState } from 'react';
import { Play, Copy, Download, Settings } from 'lucide-react';

interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const endpoints: Endpoint[] = [
  { path: '/api/v1/auth/login', method: 'POST' },
  { path: '/api/v1/users/me', method: 'GET' },
  { path: '/api/v1/projects', method: 'GET' },
  { path: '/api/v1/analytics', method: 'GET' },
];

const methodColors: Record<string, string> = {
  GET: 'text-green-400 border-green-400/30',
  POST: 'text-blue-400 border-blue-400/30',
  PUT: 'text-yellow-400 border-yellow-400/30',
  DELETE: 'text-red-400 border-red-400/30',
};

export default function APIPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState('{\n  "email": "user@example.com",\n  "password": "your-password"\n}');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const executeRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse = {
      success: true,
      data: {
        id: 'usr_123abc',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'admin',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: 'req_xyz789',
      },
    };
    
    setResponseTime(Date.now() - startTime);
    setStatusCode(200);
    setResponse(JSON.stringify(mockResponse, null, 2));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedEndpoint.path}
          onChange={(e) => {
            const endpoint = endpoints.find(en => en.path === e.target.value);
            if (endpoint) setSelectedEndpoint(endpoint);
          }}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
        >
          {endpoints.map(ep => (
            <option key={ep.path} value={ep.path} className="bg-black">
              {ep.method} {ep.path}
            </option>
          ))}
        </select>
        <button
          onClick={executeRequest}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0082D8] text-white font-medium hover:bg-[#0082D8]/90 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Send
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Request Body</h4>
            <button className="p-1.5 rounded hover:bg-white/10 text-white/40">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-sm text-white/80 resize-none focus:outline-none focus:border-white/30"
          />
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 rounded bg-white/10 text-white/60 text-sm hover:bg-white/20">
              Headers
            </button>
            <button className="px-3 py-1.5 rounded bg-white/10 text-white/60 text-sm hover:bg-white/20">
              Auth
            </button>
            <button className="px-3 py-1.5 rounded bg-white/10 text-white/60 text-sm hover:bg-white/20">
              Params
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h4 className="text-white font-medium">Response</h4>
              {statusCode && (
                <span className={`px-2 py-0.5 rounded text-xs ${
                  statusCode < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {statusCode} OK
                </span>
              )}
              {responseTime !== null && (
                <span className="text-white/40 text-xs">
                  {responseTime}ms
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-white/10 text-white/40">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/10 text-white/40">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          {response ? (
            <pre className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-sm text-white/80 overflow-auto">
              {response}
            </pre>
          ) : (
            <div className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 flex items-center justify-center">
              <p className="text-white/40 text-sm">Click "Send" to execute request</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}