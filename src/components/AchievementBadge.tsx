import { useState } from 'react';
import { Lock, Star, Trophy, Zap, Crown, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

const achievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first task', icon: '🎯', progress: 1, maxProgress: 1, unlocked: true, rarity: 'common', points: 10 },
  { id: '2', title: 'Team Player', description: 'Join a team project', icon: '👥', progress: 3, maxProgress: 5, unlocked: false, rarity: 'common', points: 25 },
  { id: '3', title: 'Speed Demon', description: 'Complete 10 tasks in a day', icon: '⚡', progress: 7, maxProgress: 10, unlocked: false, rarity: 'rare', points: 50 },
  { id: '4', title: 'Problem Solver', description: 'Resolve 50 issues', icon: '🧩', progress: 50, maxProgress: 50, unlocked: true, rarity: 'epic', points: 100 },
  { id: '5', title: 'Legend', description: 'Reach level 50', icon: '👑', progress: 35, maxProgress: 50, unlocked: false, rarity: 'legendary', points: 500 },
  { id: '6', title: 'Early Bird', description: 'Log in 5 days in a row', icon: '🌅', progress: 5, maxProgress: 5, unlocked: true, rarity: 'common', points: 15 },
  { id: '7', title: 'Code Master', description: 'Write 10000 lines of code', icon: '💻', progress: 4500, maxProgress: 10000, unlocked: false, rarity: 'epic', points: 200 },
  { id: '8', title: 'Mentor', description: 'Help 10 team members', icon: '🎓', progress: 4, maxProgress: 10, unlocked: false, rarity: 'rare', points: 75 },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return '#fbbf24 text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    case 'epic': return '#a855f7 text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'rare': return '#3b82f6 text-blue-400 border-blue-400/30 bg-blue-400/10';
    default: return '#6b7280 text-gray-400 border-gray-400/30 bg-gray-400/10';
  }
};

const getRarityBg = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'from-yellow-500/20 to-amber-500/20';
    case 'epic': return 'from-purple-500/20 to-pink-500/20';
    case 'rare': return 'from-blue-500/20 to-cyan-500/20';
    default: return 'from-gray-500/20 to-slate-500/20';
  }
};

export default function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
  const rarityClass = getRarityColor(achievement.rarity);
  const bgClass = getRarityBg(achievement.rarity);

  return (
    <div className={`relative p-4 rounded-2xl border backdrop-blur-xl transition-all hover:scale-[1.02] ${
      achievement.unlocked 
        ? rarityClass 
        : 'border-white/10 bg-white/5 opacity-60'
    }`}>
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br bg-gray-900/50 rounded-2xl z-0" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{achievement.icon}</div>
          {achievement.unlocked ? (
            <Trophy className="w-5 h-5 text-yellow-400" />
          ) : (
            <Lock className="w-5 h-5 text-white/30" />
          )}
        </div>

        <h3 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-white/60'}`}>
          {achievement.title}
        </h3>
        <p className="text-sm text-white/50 mb-3">{achievement.description}</p>

        {!achievement.unlocked && (
          <div className="mb-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: '#0082D8'
                }}
              />
            </div>
            <div className="text-xs text-white/40 mt-1">
              {achievement.progress} / {achievement.maxProgress}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${rarityClass}`}>
            {achievement.rarity}
          </span>
          <span className="text-sm font-medium text-[#0082D8]">
            +{achievement.points} pts
          </span>
        </div>
      </div>
    </div>
  );
}

export function AchievementsGrid() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
              filter === f 
                ? 'bg-[#0082D8] text-white' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(a => (
          <AchievementBadge key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
}