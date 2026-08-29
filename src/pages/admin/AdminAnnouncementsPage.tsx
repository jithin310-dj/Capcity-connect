import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { announcementService } from '../../services/announcementService';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';
import { Announcement } from '../../types';
import { 
  Megaphone, Plus, Trash2, CheckCircle2, AlertTriangle, 
  Info, Clock, Bell, Search, Filter, ShieldAlert, Sparkles, Send
} from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>(storageService.getAnnouncements());
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Compliance & Policy');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetRole, setTargetRole] = useState<'all' | 'trainee' | 'trainer'>('all');
  const [pushNotification, setPushNotification] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch = 
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ann.content || ann.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ann.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = filterRole === 'all' || ann.targetRole === filterRole || ann.targetAudience?.toLowerCase() === filterRole.toLowerCase();
      const matchesPriority = filterPriority === 'all' || ann.priority === filterPriority;

      return matchesSearch && matchesRole && matchesPriority;
    });
  }, [announcements, searchQuery, filterRole, filterPriority]);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) {
      showToast('Please enter title and announcement content', 'warning');
      return;
    }

    const created = announcementService.createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      description: content.trim(),
      category: category.trim(),
      priority,
      targetRole,
      targetAudience: targetRole === 'trainee' ? 'Trainees' : targetRole === 'trainer' ? 'Trainers' : 'Everyone',
      authorId: user._id,
      authorName: user.name,
      authorRole: user.role
    });

    if (pushNotification) {
      notificationService.sendNotification({
        userId: 'all',
        title: `📢 Announcement: ${title.trim()}`,
        message: content.trim(),
        type: priority === 'high' ? 'warning' : 'info',
        link: '/announcements'
      });
    }

    setAnnouncements(storageService.getAnnouncements());
    setShowModal(false);
    setTitle('');
    setContent('');
    setPriority('medium');
    setTargetRole('all');
    showToast(
      pushNotification 
        ? 'Platform announcement broadcasted & instant notifications pushed!' 
        : 'Platform announcement broadcasted successfully!', 
      'success'
    );
  };

  const handleDelete = (id: string) => {
    announcementService.deleteAnnouncement(id);
    setAnnouncements(storageService.getAnnouncements());
    showToast('Announcement removed', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Platform Broadcast & Institutional Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Publish systemic updates, compliance notices, and accreditation schedules to all users with real-time in-app notification dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Roles</option>
            <option value="trainee">Trainees</option>
            <option value="trainer">Trainers</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Alert</option>
            <option value="medium">Medium</option>
            <option value="low">Low Notice</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            <Megaphone className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No announcements matching your filters</h3>
            <p className="text-xs mt-1">Try clearing search filters or create a new broadcast.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-3 relative overflow-hidden transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                      ann.priority === 'high'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50'
                        : ann.priority === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>

                  {ann.category && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold font-mono">
                      {ann.category}
                    </span>
                  )}

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Target: <strong className="text-slate-800 dark:text-slate-200 capitalize">{ann.targetRole || ann.targetAudience}</strong>
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(ann._id)}
                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content || ann.description}</p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Posted by: <strong className="text-slate-800 dark:text-slate-200">{ann.authorName}</strong></span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create System Broadcast</h3>
              </div>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Headline *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mandatory DPDP Compliance Verification Scheduled"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="Compliance & Policy">Compliance</option>
                    <option value="Accreditation">Accreditation</option>
                    <option value="Examination">Examination</option>
                    <option value="Course Release">Course Release</option>
                    <option value="System Maintenance">Maintenance</option>
                    <option value="General Notice">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="low">Low Notice</option>
                    <option value="medium">Medium</option>
                    <option value="high">High Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                  >
                    <option value="all">All Users</option>
                    <option value="trainee">Trainees</option>
                    <option value="trainer">Trainers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Announcement Details *</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text details of announcement, dates, requirements, or instructions..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <input
                  type="checkbox"
                  id="pushNotifToggle"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pushNotifToggle" className="text-xs font-bold text-indigo-950 dark:text-indigo-300 cursor-pointer flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Push instant notification alert to all target recipients</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

