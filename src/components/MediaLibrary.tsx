import { useState } from 'react';
import { Upload, Search, Grid, List, Image, Film, FileText, Trash2, Download } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
}

const sampleMedia: MediaItem[] = [
  { id: '1', name: 'hero-image.jpg', type: 'image', url: '#', size: '2.4 MB', uploadedAt: '2026-04-12' },
  { id: '2', name: 'product-demo.mp4', type: 'video', url: '#', size: '45 MB', uploadedAt: '2026-04-10' },
  { id: '3', name: 'logo.svg', type: 'image', url: '#', size: '12 KB', uploadedAt: '2026-04-08' },
  { id: '4', name: 'case-study.pdf', type: 'document', url: '#', size: '1.8 MB', uploadedAt: '2026-04-05' },
  { id: '5', name: 'team-photo.jpg', type: 'image', url: '#', size: '3.2 MB', uploadedAt: '2026-04-01' },
  { id: '6', name: 'tutorial.mp4', type: 'video', url: '#', size: '120 MB', uploadedAt: '2026-03-28' },
];

export default function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredMedia = sampleMedia.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8" />;
      case 'video': return <Film className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="all" className="bg-black">All Types</option>
            <option value="image" className="bg-black">Images</option>
            <option value="video" className="bg-black">Videos</option>
            <option value="document" className="bg-black">Documents</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#0082D8] text-white' : 'bg-white/10 text-white/60'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#0082D8] text-white' : 'bg-white/10 text-white/60'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0082D8] text-white font-medium hover:bg-[#0082D8]/90">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map(item => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors group"
            >
              <div className="aspect-square bg-white/5 flex items-center justify-center text-white/30">
                {getIcon(item.type)}
              </div>
              <div className="p-3">
                <p className="text-white text-sm truncate">{item.name}</p>
                <p className="text-white/40 text-xs">{item.size}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <button className="p-1.5 rounded bg-black/50 text-white/60 hover:text-white">
                  <Download className="w-3 h-3" />
                </button>
                <button className="p-1.5 rounded bg-black/50 text-white/60 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">Name</th>
                <th className="text-left p-4 text-white/60 font-medium">Type</th>
                <th className="text-left p-4 text-white/60 font-medium">Size</th>
                <th className="text-left p-4 text-white/60 font-medium">Uploaded</th>
                <th className="text-right p-4 text-white/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">{item.name}</td>
                  <td className="p-4 text-white/60 capitalize">{item.type}</td>
                  <td className="p-4 text-white/60">{item.size}</td>
                  <td className="p-4 text-white/60">{item.uploadedAt}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 mx-auto text-white/20 mb-4" />
          <p className="text-white/40">No media files found</p>
        </div>
      )}
    </div>
  );
}