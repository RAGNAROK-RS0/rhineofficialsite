import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import ContentEditor from '../../components/ContentEditor';
import MediaLibrary from '../../components/MediaLibrary';
import { FileText, Image, Settings, BarChart3, Plus, Eye, Edit, Trash2 } from 'lucide-react';

type TabType = 'content' | 'media' | 'settings';

export default function AdvancedCMS() {
  const { themeColor } = useThemeHue();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stats = {
    totalContent: 24,
    published: 18,
    drafts: 6,
    totalMedia: 156,
  };

  const tabs = [
    { id: 'content' as const, label: 'Content', icon: <FileText className="w-4 h-4" />, count: stats.totalContent },
    { id: 'media' as const, label: 'Media Library', icon: <Image className="w-4 h-4" />, count: stats.totalMedia },
    { id: 'settings' as const, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Advanced CMS</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Content Management</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Powerful headless CMS with rich content editing, media management, 
              and multi-channel publishing capabilities.
            </p>
          </div>
        </section>

        <section className="py-8 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.totalContent}</div>
                <div className="text-white/50 text-sm">Total Content</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.published}</div>
                <div className="text-white/50 text-sm">Published</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.drafts}</div>
                <div className="text-white/50 text-sm">Drafts</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.totalMedia}</div>
                <div className="text-white/50 text-sm">Media Files</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8">
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
                  {tab.count && (
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {activeTab === 'content' && <ContentEditor />}
              {activeTab === 'media' && <MediaLibrary />}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-4">CMS Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <label className="text-white/60 text-sm">Site Name</label>
                        <input type="text" defaultValue="Rhine Solution" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <label className="text-white/60 text-sm">Default Language</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1">
                          <option className="bg-black">English</option>
                          <option className="bg-black">German</option>
                          <option className="bg-black">French</option>
                        </select>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <label className="text-white/60 text-sm">Content URL Prefix</label>
                        <input type="text" defaultValue="/blog" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <label className="text-white/60 text-sm">API Version</label>
                        <input type="text" defaultValue="v1" disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/50 mt-1" />
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#0082D8] text-white font-medium hover:bg-[#0082D8]/90">
                    Save Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}