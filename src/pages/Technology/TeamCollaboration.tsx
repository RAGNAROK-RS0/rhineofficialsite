import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import KanbanBoard from '../../components/KanbanBoard';
import TimeTracker from '../../components/TimeTracker';
import TeamCalendar from '../../components/TeamCalendar';
import { Kanban, Calendar, Clock, Users, FileText, BarChart3 } from 'lucide-react';

type TabType = 'kanban' | 'calendar' | 'time';

export default function TeamCollaboration() {
  const { themeColor } = useThemeHue();
  const [activeTab, setActiveTab] = useState<TabType>('kanban');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tabs = [
    { id: 'kanban' as const, label: 'Kanban Board', icon: <Kanban className="w-4 h-4" /> },
    { id: 'calendar' as const, label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'time' as const, label: 'Time Tracking', icon: <Clock className="w-4 h-4" /> },
  ];

  const features = [
    { icon: <Kanban className="w-6 h-6" />, title: 'Kanban Board', description: 'Visual workflow management with drag-and-drop tasks' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Team Calendar', description: 'Schedule meetings, deadlines, and events' },
    { icon: <Clock className="w-6 h-6" />, title: 'Time Tracking', description: 'Track billable hours and project time' },
    { icon: <Users className="w-6 h-6" />, title: 'Team Management', description: 'Assign tasks and track progress' },
    { icon: <FileText className="w-6 h-6" />, title: 'File Sharing', description: 'Share documents within projects' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Reports', description: 'Generate time and project reports' },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Team Collaboration</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Collaboration Pro</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Complete team collaboration suite with Kanban boards, calendar scheduling, 
              and time tracking to boost productivity.
            </p>

            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id ? 'text-white' : 'bg-white/10 text-white/70'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: themeColor } : {}}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40 min-h-[600px]">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'kanban' && <KanbanBoard />}
            {activeTab === 'calendar' && <TeamCalendar />}
            {activeTab === 'time' && <TimeTracker />}
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${themeColor}20` }}
                  >
                    <span style={{ color: themeColor }}>{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}