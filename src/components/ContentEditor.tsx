import { useState } from 'react';
import { Save, Eye, FileText, Tag, Calendar, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const sampleContent: ContentItem[] = [
  { id: '1', title: 'Getting Started with WebGPU', content: 'Introduction to WebGPU API...', category: 'Technology', tags: ['webgpu', '3d', 'graphics'], status: 'published', createdAt: '2026-04-10', updatedAt: '2026-04-12' },
  { id: '2', title: 'Best Practices for React', content: 'React best practices guide...', category: 'Development', tags: ['react', 'javascript'], status: 'published', createdAt: '2026-04-08', updatedAt: '2026-04-09' },
  { id: '3', title: 'Cloud Security Guide', content: 'Cloud security overview...', category: 'Security', tags: ['cloud', 'security'], status: 'draft', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { id: '4', title: 'AI Integration Tutorial', content: 'How to integrate AI...', category: 'AI', tags: ['ai', 'ml'], status: 'draft', createdAt: '2026-04-01', updatedAt: '2026-04-02' },
];

export default function ContentEditor() {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');

  const categories = ['Technology', 'Development', 'Security', 'AI', 'Business', 'News'];
  const [newCategory, setNewCategory] = useState('');

  return (
    <div>
      {activeTab === 'list' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value="">All Status</option>
                <option value="published" className="bg-black">Published</option>
                <option value="draft" className="bg-black">Draft</option>
              </select>
            </div>
            <button
              onClick={() => { setContent({ id: '', title: '', content: '', category: '', tags: [], status: 'draft', createdAt: '', updatedAt: '' }); setIsEditing(false); setActiveTab('editor'); }}
              className="px-4 py-2 rounded-lg bg-[#0082D8] text-white font-medium hover:bg-[#0082D8]/90"
            >
              + New Content
            </button>
          </div>

          <div className="space-y-2">
            {sampleContent.map(item => (
              <div 
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => { setContent(item); setIsEditing(true); setActiveTab('editor'); }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">{item.title}</h3>
                    <p className="text-white/50 text-sm line-clamp-2">{item.content}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-white/40 text-sm">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.tags.join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('list')}
              className="text-white/60 hover:text-white"
            >
              ← Back
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={content?.title || ''}
                onChange={(e) => setContent({ ...content!, title: e.target.value })}
                placeholder="Content Title"
                className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <textarea
                value={content?.content || ''}
                onChange={(e) => setContent({ ...content!, content: e.target.value })}
                placeholder="Write your content here... (Markdown supported)"
                className="w-full h-96 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-white/60 text-sm">Category</label>
                    <select
                      value={content?.category || ''}
                      onChange={(e) => setContent({ ...content!, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={content?.tags.join(', ') || ''}
                      onChange={(e) => setContent({ ...content!, tags: e.target.value.split(',').map(t => t.trim()) })}
                      placeholder="tag1, tag2, tag3"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Status</label>
                    <select
                      value={content?.status || 'draft'}
                      onChange={(e) => setContent({ ...content!, status: e.target.value as 'draft' | 'published' })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white mt-1"
                    >
                      <option value="draft" className="bg-black">Draft</option>
                      <option value="published" className="bg-black">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0082D8] text-white font-medium hover:bg-[#0082D8]/90">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}