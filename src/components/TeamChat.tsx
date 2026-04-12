import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Send, Image, File, X, ChevronDown, ChevronUp, Users, FileText, Download, Trash2, Clock, User, Shield } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ActivityItem {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

interface TeamChatProps {
  onClose?: () => void;
}

export default function TeamChat({ onClose }: TeamChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'system', senderName: 'System', content: 'Welcome to team chat!', timestamp: new Date().toISOString(), type: 'text' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([
    { id: '1', action: 'joined', userId: 'user1', userName: 'Alex', timestamp: new Date().toISOString() },
    { id: '2', action: 'uploaded', userId: 'user2', userName: 'Sarah', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'project-design.fig' },
    { id: '3', action: 'created', userId: 'user3', userName: 'Mike', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'WebGPU Prototype' },
  ]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; url: string }[]>([]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSending(false);

    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      action: 'sent message',
      userId: user.id,
      userName: message.senderName,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prev => [activity, ...prev]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, { name: file.name, size: file.size, url: fileUrl }]);
      
      const message: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        senderId: user?.id || 'anon',
        senderName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
        content: `Shared file: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: 'file',
        fileUrl,
        fileName: file.name,
      };
      setMessages(prev => [...prev, message]);
    });

    setUploadModalOpen(false);
  };

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'joined': return <User className="w-4 h-4 text-green-400" />;
      case 'uploaded': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'created': return <Users className="w-4 h-4 text-purple-400" />;
      case 'sent message': return <MessageSquare className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-white/50" />;
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-semibold text-white">Team Chat</h2>
        </div>
        <button onClick={() => setShowActivityLog(!showActivityLog)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          {showActivityLog ? <ChevronDown className="w-5 h-5 text-white/60" /> : <ChevronUp className="w-5 h-5 text-white/60" />}
        </button>
      </div>

      <div className="flex">
        <div className="flex-1 flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === user?.id ? 'bg-brand-primary/20' : 'bg-white/10'}`}>
                  <div className="text-xs text-white/50 mb-1">{msg.senderName}</div>
                  {msg.type === 'file' ? (
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white/90">{msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-white/90">{msg.content}</p>
                  )}
                  <div className="text-xs text-white/30 mt-1">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
              <label className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                <File className="w-5 h-5 text-white/60" />
              </label>
              <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="p-2 rounded-lg bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary transition-colors disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showActivityLog && (
          <div className="w-64 border-l border-white/10 p-4 bg-black/40 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Activity Log
            </h3>
            <div className="space-y-3">
              {activityLog.map(act => (
                <div key={act.id} className="flex items-start gap-2 text-sm">
                  {getActivityIcon(act.action)}
                  <div>
                    <span className="text-white/90">{act.userName}</span>
                    <span className="text-white/60"> {act.action}</span>
                    {act.details && <span className="text-white/50 text-xs"> - {act.details}</span>}
                    <div className="text-xs text-white/30">{formatTime(act.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <h4 className="text-xs text-white/60 mb-2">Shared Files</h4>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <File className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/90 truncate max-w-[100px]">{file.name}</span>
                <span className="text-xs text-white/50">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TeamRolesProps {
  onClose?: () => void;
}

export function TeamRoles({ onClose }: TeamRolesProps) {
  const { user } = useAuth();
  const [members] = useState([
    { id: '1', name: 'Alex Chen', email: 'alex@example.com', role: 'admin', permissions: { read: true, write: true, delete: true } },
    { id: '2', name: 'Sarah Kim', email: 'sarah@example.com', role: 'member', permissions: { read: true, write: true, delete: false } },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'viewer', permissions: { read: true, write: false, delete: false } },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400';
      case 'member': return 'bg-blue-500/20 text-blue-400';
      case 'viewer': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Shield className="w-6 h-6 text-brand-primary" />
        <h2 className="text-xl font-bold text-white">Team Roles</h2>
      </div>

      <div className="mt-4 space-y-3">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                {member.name[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{member.name}</div>
                <div className="text-xs text-white/50">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${getRoleColor(member.role)}`}>
                {member.role}
              </span>
              <div className="flex gap-1">
                {member.permissions.read && <span className="w-2 h-2 rounded-full bg-green-500" title="Read" />}
                {member.permissions.write && <span className="w-2 h-2 rounded-full bg-blue-500" title="Write" />}
                {member.permissions.delete && <span className="w-2 h-2 rounded-full bg-red-500" title="Delete" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}