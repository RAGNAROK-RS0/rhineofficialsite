import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { File, Upload, Download, Trash2, Folder, Image, FileText, Film, Music, Archive, Search, Filter, Grid, List, X, ExternalLink, Share2, Clock, HardDrive } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface FileSharingProps {
  onClose?: () => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-green-400" />;
  if (type.startsWith('video/')) return <Film className="w-5 h-5 text-purple-400" />;
  if (type.startsWith('audio/')) return <Music className="w-5 h-5 text-yellow-400" />;
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText className="w-5 h-5 text-blue-400" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive className="w-5 h-5 text-orange-400" />;
  return <File className="w-5 h-5 text-white/50" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default function FileSharing({ onClose }: FileSharingProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'project-design.fig', type: 'application/octet-stream', size: 2457600, url: '#', uploadedAt: new Date().toISOString(), uploadedBy: 'Sarah' },
    { id: '2', name: 'logo.svg', type: 'image/svg+xml', size: 12480, url: '#', uploadedAt: new Date(Date.now() - 3600000).toISOString(), uploadedBy: 'Alex' },
    { id: '3', name: 'documentation.pdf', type: 'application/pdf', size: 1048576, url: '#', uploadedAt: new Date(Date.now() - 86400000).toISOString(), uploadedBy: 'Mike' },
    { id: '4', name: 'presentation.mp4', type: 'video/mp4', size: 52428800, url: '#', uploadedAt: new Date(Date.now() - 172800000).toISOString(), uploadedBy: 'You' },
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const url = URL.createObjectURL(file);
      const newFile: FileItem = {
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
      };
      setFiles(prev => [newFile, ...prev]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    Array.from(droppedFiles).forEach(file => {
      const url = URL.createObjectURL(file);
      const newFile: FileItem = {
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
      };
      setFiles(prev => [newFile, ...prev]);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const filteredFiles = files
    .filter(f => searchQuery === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(f => filterType === 'all' || f.type.startsWith(filterType));

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const imageCount = files.filter(f => f.type.startsWith('image/')).length;
  const docCount = files.filter(f => f.type.includes('pdf') || f.type.includes('document') || f.type.includes('text')).length;

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Folder className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-semibold text-white">File Sharing</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}>
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application">Documents</option>
          </select>
          <label className="px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <div
        className={`p-4 border-b border-white/10 ${dragOver ? 'bg-brand-primary/10' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-white/60">
            <span className="flex items-center gap-1"><File className="w-4 h-4" /> {files.length} files</span>
            <span className="flex items-center gap-1"><Image className="w-4 h-4" /> {imageCount} images</span>
            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {docCount} docs</span>
          </div>
          <div className="flex items-center gap-1 text-white/50">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(totalSize)} used</span>
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Folder className="w-8 h-8 text-white/30" />
          </div>
          <div className="text-white/60 mb-2">No files found</div>
          <div className="text-sm text-white/40">Upload files or adjust your search</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto">
          {filteredFiles.map(file => (
            <div key={file.id} className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div className="text-sm text-white text-center truncate w-full">{file.name}</div>
                <div className="text-xs text-white/40">{formatFileSize(file.size)}</div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20" title="Download">
                  <Download className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button onClick={() => handleDelete(file.id)} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30" title="Delete">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 sticky top-0">
              <tr className="text-left text-white/50">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium hidden sm:table-cell">Size</th>
                <th className="p-3 font-medium hidden md:table-cell">Uploaded By</th>
                <th className="p-3 font-medium hidden lg:table-cell">Date</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map(file => (
                <tr key={file.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="text-white truncate max-w-[200px]">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-white/60 hidden sm:table-cell">{formatFileSize(file.size)}</td>
                  <td className="p-3 text-white/60 hidden md:table-cell">{file.uploadedBy}</td>
                  <td className="p-3 text-white/40 hidden lg:table-cell">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button className="p-2 rounded-lg hover:bg-white/10" title="Download">
                        <Download className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10" title="Share">
                        <Share2 className="w-4 h-4 text-white/60" />
                      </button>
                      <button onClick={() => handleDelete(file.id)} className="p-2 rounded-lg hover:bg-red-500/20" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface NotificationPreferencesProps {
  onClose?: () => void;
}

export function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState({
    email: { important: true, updates: true, marketing: false, security: true },
    push: { messages: true, mentions: true, activity: false },
    frequency: 'instant',
  });

  const toggleEmailSetting = (setting: keyof typeof preferences.email) => {
    setPreferences(prev => ({
      ...prev,
      email: { ...prev.email, [setting]: !prev.email[setting] },
    }));
  };

  const togglePushSetting = (setting: keyof typeof preferences.push) => {
    setPreferences(prev => ({
      ...prev,
      push: { ...prev.push, [setting]: !prev.push[setting] },
    }));
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Filter className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Email Notifications</h3>
          <div className="space-y-3">
            {Object.entries(preferences.email).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70 capitalize">{key}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleEmailSetting(key as keyof typeof preferences.email)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-primary focus:ring-brand-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Push Notifications</h3>
          <div className="space-y-3">
            {Object.entries(preferences.push).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-white/70 capitalize">{key}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => togglePushSetting(key as keyof typeof preferences.push)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-primary focus:ring-brand-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">Frequency</h3>
          <select
            value={preferences.frequency}
            onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="instant">Instant</option>
            <option value="hourly">Hourly Digest</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
        </div>
      </div>
    </div>
  );
}