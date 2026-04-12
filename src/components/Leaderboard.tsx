import { useState, useEffect } from 'react';
import { Crown, Medal, User } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  trend: 'up' | 'down' | 'same';
}

const users: LeaderboardUser[] = [
  { id: '1', name: 'Alex Chen', avatar: 'AC', points: 12500, level: 42, trend: 'up' },
  { id: '2', name: 'Sarah Miller', avatar: 'SM', points: 11200, level: 38, trend: 'up' },
  { id: '3', name: 'James Wilson', avatar: 'JW', points: 9800, level: 35, trend: 'down' },
  { id: '4', name: 'Emily Davis', avatar: 'ED', points: 8900, level: 32, trend: 'same' },
  { id: '5', name: 'Michael Brown', avatar: 'MB', points: 7500, level: 28, trend: 'up' },
  { id: '6', name: 'Lisa Anderson', avatar: 'LA', points: 6200, level: 24, trend: 'up' },
  { id: '7', name: 'David Lee', avatar: 'DL', points: 5800, level: 22, trend: 'down' },
  { id: '8', name: 'You', avatar: 'YO', points: 4500, level: 18, trend: 'up' },
];

export default function Leaderboard() {
  const [currentUserId] = useState('8');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-white/40 w-5 text-center">{rank}</span>;
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#0082D8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-medium">Leaderboard</h3>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs capitalize ${
                timeFilter === t 
                  ? 'bg-[#0082D8] text-white' 
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {users.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.id === currentUserId;
          
          return (
            <div 
              key={user.id}
              className={`p-4 flex items-center gap-4 ${
                isCurrentUser ? 'bg-[#0082D8]/10 border-l-2 border-[#0082D8]' : ''
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(rank)}
              </div>

              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ 
                  backgroundColor: `${getAvatarColor(user.name)}20`,
                  color: getAvatarColor(user.name)
                }}
              >
                {user.avatar}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isCurrentUser ? 'text-[#0082D8]' : 'text-white'}`}>
                    {user.name}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#0082D8]/20 text-[#0082D8]">
                      You
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/40">Level {user.level}</span>
              </div>

              <div className="text-right">
                <div className="text-white font-medium">{user.points.toLocaleString()}</div>
                <div className="text-xs text-white/40">points</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}