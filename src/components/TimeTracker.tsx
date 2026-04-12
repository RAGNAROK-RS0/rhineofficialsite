import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Clock, Calendar } from 'lucide-react';

interface TimeEntry {
  id: string;
  project: string;
  startTime: number;
  endTime?: number;
  duration: number;
}

const projects = ['Development', 'Design', 'Meeting', 'Research', 'Admin'];

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    const stored = localStorage.getItem('time_entries');
    return stored ? JSON.parse(stored) : [];
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    localStorage.setItem('time_entries', JSON.stringify(entries));
  }, [entries]);

  const startTimer = () => {
    setStartTime(Date.now());
    setElapsed(0);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (startTime) {
      const entry: TimeEntry = {
        id: Date.now().toString(),
        project: selectedProject,
        startTime,
        endTime: Date.now(),
        duration: Math.floor((Date.now() - startTime) / 1000),
      };
      setEntries([entry, ...entries].slice(0, 50));
    }
    setIsRunning(false);
    setStartTime(null);
    setElapsed(0);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalToday = entries
    .filter(e => {
      const entryDate = new Date(e.startTime).toDateString();
      const today = new Date().toDateString();
      return entryDate === today;
    })
    .reduce((acc, e) => acc + e.duration, 0);

  const getProjectColor = (project: string) => {
    const colors: Record<string, string> = {
      Development: '#0082D8',
      Design: '#10b981',
      Meeting: '#f59e0b',
      Research: '#8b5cf6',
      Admin: '#6b7280',
    };
    return colors[project] || '#0082D8';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
            disabled={isRunning}
          >
            {projects.map(p => (
              <option key={p} value={p} className="bg-black">{p}</option>
            ))}
          </select>

          <div className="text-4xl font-mono text-white">
            {formatDuration(elapsed)}
          </div>

          <button
            onClick={isRunning ? stopTimer : startTimer}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-[#0082D8] text-white hover:bg-[#0082D8]/90'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-white/60">
          <Clock className="w-4 h-4" />
          <span>Today: {formatDuration(totalToday)}</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Recent Entries
        </h3>
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getProjectColor(entry.project) }}
                />
                <span className="text-white">{entry.project}</span>
              </div>
              <div className="text-white/60 text-sm">
                {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
              </div>
              <div className="text-white font-mono text-sm">
                {formatDuration(entry.duration)}
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-white/40 text-center py-4">No time entries yet</div>
          )}
        </div>
      </div>
    </div>
  );
}