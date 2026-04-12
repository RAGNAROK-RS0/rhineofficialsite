import React, { useState, useEffect } from 'react';
import { SecurityEvent, useAuditLog } from '../lib/security';

interface SecurityDashboardProps {
  maxEvents?: number;
}

export default function SecurityDashboard({ maxEvents = 20 }: SecurityDashboardProps) {
  const { getLogs } = useAuditLog();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const allEvents = getLogs();
    const filtered = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter);
    setEvents(filtered.slice(0, maxEvents));
  }, [filter, getLogs, maxEvents]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-white/60 bg-white/5';
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-bold">Security Events</h3>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-black/60 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
        >
          <option value="all">All Events</option>
          <option value="login">Login</option>
          <option value="failed_login">Failed Login</option>
          <option value="permission_denied">Permission Denied</option>
          <option value="api_call">API Call</option>
        </select>
      </div>
      <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-8 text-center text-white/40">No security events recorded</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{event.message}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {event.timestamp.toLocaleString()} • {event.type}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                  {event.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}