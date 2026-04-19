import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { AchievementsGrid } from '../../components/AchievementBadge';
import Leaderboard from '../../components/Leaderboard';
import { Trophy, Zap, Star, Crown, Target, Lock } from 'lucide-react';

export default function Gamification() {
  const { themeColor } = useThemeHue();
  const [userStats, setUserStats] = useState({
    points: 4500,
    level: 18,
    rank: 8,
    totalUsers: 156,
    nextLevelPoints: 5000,
    achievementsUnlocked: 12,
    totalAchievements: 24,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const progressPercent = ((userStats.points - (userStats.nextLevelPoints - 1000)) / 1000) * 100;

  const levels = [
    { level: 1, minPoints: 0, title: 'Newcomer' },
    { level: 10, minPoints: 1000, title: 'Contributor' },
    { level: 20, minPoints: 5000, title: 'Expert' },
    { level: 30, minPoints: 15000, title: 'Master' },
    { level: 40, minPoints: 50000, title: 'Legend' },
    { level: 50, minPoints: 100000, title: 'Champion' },
  ];

  const currentLevelInfo = levels.find(l => l.level <= userStats.level) || levels[0];
  const nextLevelInfo = levels.find(l => l.level > userStats.level) || levels[levels.length - 1];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Gamification</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Achievements</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Earn points, unlock achievements, and climb the leaderboard. 
              Engage with the platform to level up and earn rewards.
            </p>
          </div>
        </section>

        <section className="py-8 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                <div className="text-2xl font-bold text-white">{userStats.points.toLocaleString()}</div>
                <div className="text-white/50 text-sm">Total Points</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                <div className="text-2xl font-bold text-white">Level {userStats.level}</div>
                <div className="text-white/50 text-sm">{currentLevelInfo.title}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                <div className="text-2xl font-bold text-white">#{userStats.rank}</div>
                <div className="text-white/50 text-sm">Rank</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2" style={{ color: themeColor }} />
                <div className="text-2xl font-bold text-white">{userStats.achievementsUnlocked}/{userStats.totalAchievements}</div>
                <div className="text-white/50 text-sm">Achievements</div>
              </div>
            </div>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Level {userStats.level} → {userStats.level + 1}</span>
                </div>
                <span className="text-white/60 text-sm">
                  {userStats.points} / {userStats.nextLevelPoints} pts
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-white/40">
                {userStats.nextLevelPoints - userStats.points} points until next level
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Achievements</h2>
            <AchievementsGrid />
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <Leaderboard />
          </div>
        </section>
      </div>
    </Layout>
  );
}